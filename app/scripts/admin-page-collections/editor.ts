import * as $ from "jquery";
import * as dragula from 'dragula';
import { Upload } from "../common/utils";
import * as jsHash from "jshashes";
import * as ps from "perfect-scrollbar";
import { imageOrientation } from "../common/portrait-landscape";


var CardCarousel = require("../common/image-slider.js");

import {sidebar} from "./editor.sidebar";
import "./editor.init";
import { orderByWeight, saveForm, stagePhoto } from "./editor.common";
import {postSimpleSaveMode} from "./editor.save";

$(function () {
    require('bootstrap-tagsinput')

   
    $("#quick-add-collection").on("keyup change", function(e){
        if($(this).val() !== ""){
            $(this).siblings().find("button").removeAttr("disabled");
        }
        else{
            $(this).siblings().find("button").attr("disabled","disabled");
        }
    })

    $("#quick-add-collection").siblings().find("button").click(function(){
        var data = postSimpleSaveMode()
        console.log(data)
        $.post("/save/collection", data, function (data) {
            if (data) {
                console.log(collection)
                location.reload();
            }
        })
    })


    // to collections
    var collection = []

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


