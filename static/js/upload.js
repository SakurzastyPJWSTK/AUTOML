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

            while(document.getElementById('emotion_label').hasChildNodes()){
                document.getElementById('emotion_label').removeChild(document.getElementById('emotion_label').firstChild);
            }

            let table = document.createElement('table');
            let thead = document.createElement('thead');
            let tbody = document.createElement('tbody');

            table.appendChild(thead);
            table.appendChild(tbody);
            let row_1 = document.createElement('tr');
            let heading_1 = document.createElement('th');
            heading_1.innerHTML = "Emocja";
            let heading_2 = document.createElement('th');
            heading_2.innerHTML = "Data urodzenia";
            let heading_3 = document.createElement('th');
            heading_3.innerHTML = "Miejsce urodzenia";
            let heading_4 = document.createElement('th');
            heading_4.innerHTML = "Wzrost";

            row_1.appendChild(heading_1);
            row_1.appendChild(heading_2);
            row_1.appendChild(heading_3);
            row_1.appendChild(heading_4);
            thead.appendChild(row_1);
            let row_2 = document.createElement('tr');
            let row_2_data_1 = document.createElement('td');
            row_2_data_1.innerHTML = data['emotion'];
            let row_2_data_2 = document.createElement('td');
            row_2_data_2.innerHTML = data['additional_info']['birthDate'];
            let row_2_data_3 = document.createElement('td');
            row_2_data_3.innerHTML = data['additional_info']['birthPlace'];
            let row_2_data_4 = document.createElement('td');
            row_2_data_4.innerHTML = data['additional_info']['heightCentimeters'];
            row_2.appendChild(row_2_data_1);
            row_2.appendChild(row_2_data_2);
            row_2.appendChild(row_2_data_3);
            row_2.appendChild(row_2_data_4);
            tbody.appendChild(row_2);

            document.getElementById('emotion_label').appendChild(table);

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