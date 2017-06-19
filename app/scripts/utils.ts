import * as $ from "jquery";

function isSVGAvatar(str) {
    //we need a really really basic and fast way to determine the avatar type
    return [
        str[0]==="<",
        str[1]==="s",
        str[2]==="v",
        str[3]==="g"
    ]
    .every(test=>test===true);
}

var Upload = function (url, file) {
    this.file = file;
    this.url = url;
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
Upload.prototype.doUpload = function () {
    var that = this;
    var formData = new FormData();

    // add assoc key values, this will be posts values
    formData.append("file", this.file, this.getName());
    $(".progress").addClass("active")
    
    formData.append("upload_file", true);

    console.log(formData.keys().next())
    console.log(formData.values().next())

    $.ajax({
        type: "POST",
        url: that.url,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', that.progressHandling, false);
            }
            return myXhr;
        },
        success: function (data) {
            setTimeout(function(){
                $(".progress").removeClass("active")
            },1000)
        },
        error: function (error) {
            setTimeout(function(){
                $(".progress").removeClass("active")
            },1000)
        },
        async: true,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000
    });
};

Upload.prototype.progressHandling = function (event) {
    var percent = 0;
    var position = event.loaded || event.position;
    var total = event.total;
    var progressBar = ".progress";
    if (event.lengthComputable) {
        percent = Math.ceil(position / total * 100);
    }
    // update progress bars classes so it fits your code
    $(progressBar + " .progress-bar").css("width", +percent + "%");
    //$(progressBar + " .status").text(percent + "%");
};


function active(base,toActive){
    $(base).find(".active").removeClass("active");
    $(base).find(toActive).addClass("active");
}


export {
    isSVGAvatar,
    Upload,
    active
}