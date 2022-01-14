var Upload = function (file) {
    this.file = file;
};

Upload.prototype.getType = function() {
    return this.file.type;
};
Upload.prototype.getSize = function() {
    return this.file.size;
};
Upload.prototype.getName = function() {
    return this.file.name;
};
Upload.prototype.doUploadPredict = function (url) {
    var that = this;
    var formData = new FormData();

    // add assoc key values, this will be posts values
    formData.append("file", this.file);
    formData.append("upload_file", true);

    $.ajax({
        type: "POST",
        url: url,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', that.progressHandling, false);
            }
            return myXhr;
        },
        success: function (data) {
            var label = 'aktor_label';
            var item = document.getElementById(label);
            item.innerHTML = data['result']
            //alert(data['result']);
        },
        error: function (error) {
            console.log("NIE DZIALA")
        },
        async: true,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000
    });

    var reader  = new FileReader();
    reader.onload = function(e)  {
        var image = document.getElementById("uploaded_image_placeholder");
        image.src = e.target.result;
    }
    reader.readAsDataURL(this.file);
};

Upload.prototype.doUploadPredictEmotion = function (url) {
    var that = this;
    var formData = new FormData();

    // add assoc key values, this will be posts values
    formData.append("file", this.file);
    formData.append("upload_file", true);

    $.ajax({
        type: "POST",
        url: url,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', that.progressHandling, false);
            }
            return myXhr;
        },
        success: function (data) {
            var label = 'emotion_label';
            var item = document.getElementById(label);
            
            item.innerHTML = JSON.stringify(data)

            //alert(data['result']);
        },
        error: function (error) {
            console.log("NIE DZIALA")
        },
        async: true,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000
    });
    
    var reader  = new FileReader();
    reader.onload = function(e)  {
        var image = document.getElementById("uploaded_image_placeholder");
        image.src = e.target.result;
    }
    reader.readAsDataURL(this.file);
};

Upload.prototype.progressHandling = function (event) {
    var percent = 0;
    var position = event.loaded || event.position;
    var total = event.total;
    var progress_bar_id = "#progress-wrp";
    if (event.lengthComputable) {
        percent = Math.ceil(position / total * 100);
    }
    // update progressbars classes so it fits your code
    $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
    $(progress_bar_id + " .status").text(percent + "%");
};