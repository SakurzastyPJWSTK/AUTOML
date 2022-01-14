function predict() {
    var file = document.getElementById("file_to_predict").files[0];
    console.log(file);
    var upload = new Upload(file);
    upload.doUploadPredict("/predict");
    upload.doUploadPredictEmotion("/predict_emotion");
  }