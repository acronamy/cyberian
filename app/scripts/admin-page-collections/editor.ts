import * as $ from "jquery";
import * as dragula from 'dragula';
import { Upload } from "../common/utils";
import * as jsHash from "jshashes";
import * as ps from "perfect-scrollbar";
import * as unique from "make-unique";

const CardCarousel = require("../common/image-slider.js");

import {sidebar} from "./editor.sidebar";

$(function () {
    require('bootstrap-tagsinput')

    if($("[data-slider]").length >0){
        $("[data-slider]").each(function(){
            new CardCarousel("#"+$(this).attr("id"));
        })
    }

    // to collections
    var collection = []

    function orderByWeight() {
        collection.sort(function (a, b) {
            return parseFloat(a.index) - parseFloat(b.index);
        });
        return collection;
    }

    function stagePhoto(e) {
        if (!e.target.hasClass("add-placeholder")) {
            //photo reference
            var ref = e.target.data("ref");
            var index = e.target.index();
            if (e.event === "upload") {
                collection.push({
                    ref: ref,
                    index: index,
                    enable: true,
                    description: "",
                })
            }
            if (e.event === "remove") {
                var deleteRef = e.target.data("ref");

                collection = collection.map(photo => {
                    if (photo.ref === deleteRef) {
                        return false;
                    }
                    else {
                        return photo;
                    }
                }).filter(Boolean)

                collection = orderByWeight();
                console.log(collection)
            }
            if (e.event === "move") {
                if (e.value.moved) {
                    var photoMatch = collection.find(photo => photo.ref === ref);
                    var siblings = collection.filter(photo => photo.ref !== ref);
                    photoMatch.index = e.value.newIndex
                    siblings.map(function (photo) {
                        photo.index = $("[data-ref='" + photo.ref + "']").index()
                    })
                }
                collection = orderByWeight();

                console.log(collection)
            }
            if (e.event === "enabled") {
                var photoMatch = collection.find(photo => photo.ref === ref);
                photoMatch.enable = e.value;
            }
            if (e.event === "description") {
                var photoMatch = collection.find(photo => photo.ref === ref);
                photoMatch.description = e.value;

                console.log(collection)
            }
        }
    }


    function saveForm(mode){

        var url;
        var data;
        var parent = $(this);
        if(mode === "save"){
            url = "/save/collection";
            //to save (ps interfaces are not working front end for me, I cba to fix, not time!)
            data = {
                name: $("#collection-name").val(),
                description: $("#collection-description").val(),
                tags: $("#collection-tags").val(),
                photoContents: JSON.stringify(collection),
                enabled: true
            };
        }
        else if(mode==="update"){
            console.log(parent)
            url = "/update/collection";

            data = {
                id:parent.data().id,
                name: parent.find("[id^='collection-name']").val(),
                description: $("[id^='collection-description']").val(),
                tags: $("[id^='collection-tags']").val(),
                photoContents: JSON.stringify(collection),
                enabled: true
            };
        }

        
        $.post(url, data, function (data) {
            if (data) {
                console.log("collection saved in "+ mode+" mode.")
                location.reload();
            }
        })
    }

    //Selectors and state
    var validationCriteria = [
        "collection-name",
        "collection-description"
    ]
    .map(function(selector){
        return "[id^="+selector+"]"
    })
    var validationStatus = {};
    validationCriteria.forEach(function(selector){
        function validateInput(){
            console.log($(this).val())
            validationStatus[$(this).attr("id")] = {
                valid:$(this).val() !== ""
            }
        }
        $(selector).each(validateInput);
        $(selector).keyup(validateInput);
        
    })

    $(document).on("submit","#save-collection, #edit-collection",function(e){
        e.preventDefault()
        var self = $(this);

        var validResults = [];
        Object.keys(validationStatus).forEach(function(key){
            var id = "#"+key;
            self.find(id).each(function(){
                validResults.push(validationStatus[$(this).attr("id")].valid)
            })
        })
        if(validResults.every(result=>result===true)){
            console.log("Valid")
            
            if(self.attr("id")==="save-collection"){
                saveForm.bind(self)("save");
            }
            else{
                saveForm.bind(self)("update");
            }
            
            $(".modal").modal("hide");
            // setTimeout(function(){
            //     window.location.reload()
            // },1000)
        }
        else{
            console.log("Invalid")
        }
    });

    var modalOptions = {
        containers: [
            document.querySelector(".modal-dialog main"),
        ],
        direction: 'horizontal',
        moves(el) {
            return true;
        },
        ignoreInputTextSelection: true
    }


    if (location.pathname.split("/")[1] === "editor" && $(".gridstack").length >= 0) {
        //editor
        dragula(modalOptions);
        sidebar()
        



        //MAIN BODY

        $(".photo-upload-target").on("change", function (e) {
            var self = $(this)
            var file = $(this)[0].files[0];
            var upload = new Upload("/save/collection/photo", file);
            // execute upload
            var MD5 = new jsHash.MD5;
            //Photo ref same as DB
            var ref = MD5.hex(file.name);
            upload.doUpload(function (uploaded) {

                if (uploaded.success) {

                    //visualize new photo
                    self.closest("main").append([
                        "<div data-ref='" + ref + "' class='tile photo-tile'>",
                        "<header class='clearfix'>",
                        '<button type="button" title="Delete photo from this collection" class="close" aria-label="Close"><span class="close-x" aria-hidden="true">×</span></button>',
                        '<div class="input-group toggle-group">',
                        '<label title="Enable / Disable photo in this collection." class="small" data-toggleswitch="data-toggle" id="for-photo-enabled">',
                        '<input checked type="checkbox" name="for-photo-enabled"/>',
                        '<div class="inner"></div>',
                        "</label>",
                        "<small class='photo-enebled-text'>",
                        "<span class='enabled-text'>Public</span>",
                        "<span class='hide disabled-text'>Private</span>",
                        "</small>",
                        "</div>",
                        "</header>",
                        "<footer>",
                        "<textarea size='2' placeholder='Description'></textarea>",
                        "</footer>",
                        `<div class='photo-tile-photo' style='background-image:url("${uploaded.data}");'></div>`,
                        "</div>"
                    ].join(""))

                    stagePhoto({
                        target: self.closest("main").children(":last-child"),
                        event: "upload",
                        value: true,
                        ref: ref
                    })

                }//end upload
            });
        })


        //EVENTS
        var dragClickPoll;
        $(document).on("mousedown", ".tile", function (e) {
            e.stopPropagation();
            if ($(e.target).hasClass("photo-tile")) {
                var self = $(this);
                var oldIndex = self.index();
                dragClickPoll = setInterval(function () {
                    if (!self.hasClass("gu-transit")) {
                        clearInterval(dragClickPoll);
                        stagePhoto({
                            target: self,
                            event: "move",
                            get value() {
                                //moved?
                                return {
                                    moved: !(self.index() === oldIndex),
                                    newIndex: self.index()
                                }
                            }
                        })
                    }
                }, 100)
            }

        })

        //enable disable toggle
        $(document).on("mouseup", "[data-toggleswitch]", function () {
            var state = !$(this).find("input[type='checkbox']").is(":checked");

            if (state === false) {
                $(".photo-enebled-text").find(".disabled-text").removeClass("hide")
                $(".photo-enebled-text").find(".enabled-text").addClass("hide")
                $(this).closest(".tile").addClass("disabled")
            }
            else {
                $(".photo-enebled-text").find(".disabled-text").addClass("hide")
                $(".photo-enebled-text").find(".enabled-text").removeClass("hide")
                $(this).closest(".tile").removeClass("disabled")
            }

            stagePhoto({
                target: $(this).closest(".tile"),
                event: "enabled",
                value: state
            })
        })
        //fade controls
        var timer;
        function setControlFade(target) {
            timer = setTimeout(function () {
                target.removeClass("show-controls")
                target.find("textarea").blur();
            }, 3000)
        }
        $(document).on("keyup", ".tile textarea", function () {
            clearTimeout(timer)
            stagePhoto({
                target: $(this).closest(".tile"),
                event: "description",
                value: $(this).val()
            })
        })
        $(document).on("mousemove", ".tile", function (e) {
            clearTimeout(timer)
            $(this).addClass("show-controls")
            setControlFade($(this))
        })
        $(document).on("mouseout", ".tile", function () {
            $(this).removeClass("show-controls")
            $(this).find("textarea").blur();
        })

        $(document).on("click", ".tile .close", function () {
            $(this).closest(".tile").remove();
            stagePhoto({
                target: $(this).closest(".tile"),
                event: "remove",
                value: true
            })

            console.log($(".add-placeholder").siblings().length)
            //validate collection form requirements
        })



        



        //Edit delete collections

        $(document).on("click", ".editor-collection-controls .btn", function () {
            var action = $(this).data("action");
            var collectionId = $(this).data("collection");

            console.log(action, collectionId)
        })

        $(document).on("click", ".modal-delete-collection .btn", function () {
            var action = $(this).data("action");
            var collectionId = $(this).data("collection");

            $.post("/delete/collection", { id: collectionId }, function (data) {
                if (data) {
                    console.log(collectionId, "deleted!");
                    $("#collection-" + collectionId).remove();
                    location.reload();
                }
            })
        })

    }
})


