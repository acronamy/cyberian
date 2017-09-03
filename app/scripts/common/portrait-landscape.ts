import * as $ from "jquery";


$(function () {
    $.fn.orientation = function () {
        var bg = this.css("background-image");
        var self = this;
        if(/"/.test(bg)){
            bg = bg.split('"')[1];
        }
        else if(/'/.test(bg)){
            bg = bg.split("'")[1];
        }

        console.log(bg)
        function imageOrientation(src) {
            var orientation,
                img = new Image();
            img.src = src;
            if (img.naturalWidth > img.naturalHeight) {
                orientation = 'orientation-landscape';
            } else if (img.naturalWidth < img.naturalHeight) {
                orientation = 'orientation-portrait';
            } else {
                orientation = 'orientation-even';
            }
            self.addClass(orientation)
            return orientation;
        }

        return imageOrientation(bg);
    }
})