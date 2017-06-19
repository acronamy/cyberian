import * as $ from "jquery";
import {Upload, active} from "./utils";

window.addEventListener("load",function(){
    setTimeout(function(){
        $("#profile-sub-navbar").stick({
        to:$("#admin-toolbar")
    });
    },1)
})

$(function(){
    var userInstance = JSON.parse(localStorage.getItem("user"));
    if($("body.page-login.logged-in").length>0){
        active($("#admin-toolbar"),".navbar-user > .dropdown");
        $(".username").append("<span class='profile-first-name'>"+userInstance.first_name+"</span> "+"<span class='profile-last-name'>"+userInstance.last_name+"</span>" )
        $(".bio").append(userInstance.bio)
    }

    $("#cover-photo").on("change",function(e){
        var file = $(this)[0].files[0];
        var upload = new Upload("/upload/cover-photo" ,file);
        // execute upload
        upload.doUpload();
    })
})