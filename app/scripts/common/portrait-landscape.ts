import * as $ from "jquery";


export async function imageOrientation(src) {
    var orientation,
        img = new Image();
    img.src = src;
    var o = await new Promise((resolve,reject)=>{
        img.onload = function(){
            if (img.naturalWidth > img.naturalHeight) {
                orientation = 'orientation-landscape';
            } else if (img.naturalWidth < img.naturalHeight) {
                orientation = 'orientation-portrait';
            } else {
                orientation = 'orientation-even';
            }
            resolve(orientation);
        }
    })
    return o;
}

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
        $(self).addClass(imageOrientation(bg));
        return imageOrientation(bg);
    }
})