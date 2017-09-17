import { Upload } from "../common/utils";
import * as jsHash from "jshashes";
import { imageOrientation } from "../common/portrait-landscape";

var collection = [];

export function orderByWeight() {
    collection.sort(function (a, b) {
        return parseFloat(a.index) - parseFloat(b.index);
    });
    return collection;
}

export function stagePhoto(e) {
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
            }).filter(Boolean);
            collection = orderByWeight();
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
        }
        if (e.event === "enabled") {
            var photoMatch = collection.find(photo => photo.ref === ref);
            photoMatch.enable = e.value;
        }
        if (e.event === "description") {
            var photoMatch = collection.find(photo => photo.ref === ref);
            photoMatch.description = e.value;

            
        }
        console.log(collection)
    }
}





export function saveForm(mode){

    var url;
    var data;
    var parent = $(this);
    if(mode === "save"){
        url = "/save/collection";
        //to save (ps interfaces are not working front end for me, I cba to fix, not time!)
        console.log(collection)
        data = {
            name: $("#collection-name").val(),
            description: $("#collection-description").val(),
            tags: $("#collection-tags").val(),
            photoContents: JSON.stringify(collection),
            enabled: true
        };
    }
    else if(mode==="update"){
        url = "/update/collection";

        parent.find(".photo-tile").each(function(index){
            var data = $(this).data()


            //if not already in collection then save it
            if( !collection.find(photo=>photo.ref != data.ref)||false ){
                collection.push({
                    ref: data.ref,
                    index: index,
                    enable: true,
                    description: "",
                })
            }

        })

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
            console.log(collection)
            //location.reload();
        }
    })
}