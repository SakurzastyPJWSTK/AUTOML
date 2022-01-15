import os
import uuid
import flask
import urllib
import numpy
import csv
import boto3
import os
import requests
import pprint
import pathlib
pathlib.WindowsPath = pathlib.PosixPath

from io import BytesIO

from fastai.vision.all import *
from fastai.vision.widgets import *

from PIL import Image
from tensorflow.keras.models import load_model
from flask import Flask, render_template, request, send_file
from tensorflow.keras.preprocessing.image import load_img, img_to_array

print(os.environ)
IMDB_API_KEY = os.environ["IMDB_API_KEY"]


class ProjectApp(Flask):
    def __init__(self):
        super().__init__(__name__)
        self._aws_auth()

    def _aws_auth(self):
        with open('credentials.csv', 'r') as input:
            next(input)
            reader = csv.reader(input)
            for line in reader:
                access_key_id = line[2]
                secret_access_key = line[3]
                client = boto3.client('rekognition',
                                      region_name='us-east-2',
                                      aws_access_key_id=access_key_id,
                                      aws_secret_access_key=secret_access_key)
            self.aws_client = client

    def get_aws_client(self):
        return self.aws_client


app = ProjectApp()


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/predict', methods=['POST'])
def predict():
    img = Image.open(request.files['file']).convert('RGB')
    img.thumbnail((250, 250), Image.ANTIALIAS)
    img = numpy.asarray(img)
    pred, pred_idx, probs = load_learner(filename).predict(img)
    print(pred, pred_idx, probs)
    return {"result": pred, "propability": f'{probs[pred_idx]*100:.02f}'}


@app.route('/predict_emotion', methods=['POST'])
def predict_emotion():
    img = Image.open(request.files['file'])
    buffered = BytesIO()
    img.save(buffered, format=img.format)
    resp = app.get_aws_client().recognize_celebrities(Image={"Bytes": buffered.getvalue()})
    imdb_id = ''
    for url in resp["CelebrityFaces"][0]["Urls"]:
        if 'imdb' in url:
            imdb_id = url.split('/')[-1]
    output_emotion = resp["CelebrityFaces"][0]["Face"]["Emotions"][0]
    for emotion in resp["CelebrityFaces"][0]["Face"]["Emotions"]:
        if emotion["Confidence"] > output_emotion["Confidence"]:
            output_emotion = emotion

    url = "https://imdb8.p.rapidapi.com/actors/get-bio"

    querystring = {"nconst": imdb_id}

    headers = {
        'x-rapidapi-host': "imdb8.p.rapidapi.com",
        'x-rapidapi-key': IMDB_API_KEY
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    pp = pprint.PrettyPrinter(indent=4)
    res = response.json()
    info = {}
    info['birthDate'] = res['birthDate']
    info['birthPlace'] = res['birthPlace']
    info['heightCentimeters'] = res['heightCentimeters']
    print(res)
    return {"emotion": output_emotion["Type"], "additional_info": info}


if __name__ == "__main__":
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    filename = 'model.pkl'
    print(Path() / filename)

    app.run(debug=True)