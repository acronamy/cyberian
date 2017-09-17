import * as $ from "jquery";
import { Upload } from "../common/utils";
import * as jsHash from "jshashes";
import { stagePhoto } from "./editor.common";
import { imageOrientation } from "../common/portrait-landscape";

//Things to load
var CardCarousel = require("../common/image-slider.js");

$(function () {

    //Create card carousels for collections
    if($("[data-slider]").length >0){
        $("[data-slider]").each(function(){
            new CardCarousel("#"+$(this).attr("id"));
        })
    }

    // $(".photo-upload-target").on("change", function (e) {
    //     var self = $(this)
    //     var file = $(this)[0].files[0];

    //     var upload = new Upload("/save/collection/photo", file);
    //     // execute upload
    //     var MD5 = new jsHash.MD5;
    //     //Photo ref same as DB
    //     var ref = MD5.hex(file.name);
    //     upload.doUpload(async function (uploaded) {

    //         if (uploaded.success) {
    //             var orientation = await imageOrientation(uploaded.data);
    //             //visualize new photo
    //             self.closest("main").append([
    //                 "<div data-ref='" + ref + "' class='tile photo-tile'>",
    //                     "<header class='clearfix'>",
    //                     '<button type="button" title="Delete photo from this collection" class="close" aria-label="Close"><span class="close-x" aria-hidden="true">×</span></button>',
    //                         '<div class="input-group toggle-group">',
    //                             '<label title="Enable / Disable photo in this collection." class="small" data-toggleswitch="data-toggle" id="for-photo-enabled">',
    //                                 '<input checked type="checkbox" name="for-photo-enabled"/>',
    //                                 '<div class="inner"></div>',
    //                             "</label>",
    //                             "<small class='photo-enebled-text'>",
    //                                 "<span class='enabled-text'>Public</span>",
    //                                 "<span class='hide disabled-text'>Private</span>",
    //                             "</small>",
    //                         "</div>",
    //                     "</header>",
    //                     "<footer>",
    //                         "<textarea size='2' placeholder='Description'></textarea>",
    //                     "</footer>",
    //                     `<div class='photo-tile-photo ${orientation}' style='background-image:url("${uploaded.data}");'></div>`,
    //                 "</div>"
    //             ].join(""))

    //             stagePhoto({
    //                 target: self.closest("main").children(":last-child"),
    //                 event: "upload",
    //                 value: true,
    //                 ref: ref
    //             })

    //         }
    //     });
    // });

});