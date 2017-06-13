import * as $ from "jquery";
import * as moustrap from "mousetrap";

$(function () {
    if ($("body").hasClass("page-login") && $("body").find(".wrapper-login").length > 0) {

        moustrap.bind("enter", function () {

            /**
             * If password is in place allow submit on enter.
            */
            if ($("#username").val() !== "") {
                $("#username").parent().removeClass("error");
                $.post("/user/login", function(userData) {
                    if(userData){
                        localStorage.setItem("user",JSON.stringify(userData))
                    }
                })
            }
            else{
                $("#username").parent().addClass("error");
            }

        })


        function setAvatar(avatar){
            if(avatar){
                $(".avatar").addClass("found")
            }
            else{
                $(".avatar").removeClass("found")
            }
            if(avatar.type === "identicon"){
                $(".avatar-inner").css({
                    backgroundImage:"url('data:image/svg+xml;utf8,"+avatar.data+"')"
                })
                .addClass("show");
            }
            else if(avatar.type === "image"){
                $(".avatar-inner").css({
                    backgroundImage:"url('"+avatar.data+"')"
                })
                .addClass("show");
            }
        }
        function unsetAvatar(){
            $(".avatar").removeClass("found")
            $(".avatar-inner").removeClass("show");
        }

        /**
         * Regaurless of if user has local strorage set, set the event listener to load user image
        */
        $("#username").on("blur", function(){
            /**
             * Find a username
            */
            $.post("/user/login/check-user", {username:$(this).val()}, function (avatar) {
                setAvatar(avatar)
            })
        })

        //user has logged in
        if(localStorage.getItem("user")){
            const userData = JSON.parse(localStorage.getItem("user"));
            $(".returning-user-ctrl").removeClass("hide");
            $("#username").val(userData.username);
            $("#returning-user-name").text(userData.name.first+" "+userData.name.last)
            $("#password").focus();
            setAvatar(userData.avatar)
        }
        //no local storage on my username
        else{
            $("#username-group").removeClass("hide");
            $("#username").focus();
        }

        
        $("#returning-user-name-cancel").click(function(){
            localStorage.removeItem("user")
            $("#username-group").removeClass("hide");
            $(".returning-user-ctrl").addClass("hide");
            $("#username").val("");
            $("#username").focus();
            unsetAvatar();
            console.log("user removed")
        })

    }
    else if($("body").hasClass("page-login") && $("body").find(".wrapper-register").length > 0){
       
       /**
        * Toggle hire status
       */
       $("[data-toggle]").on("mouseup",function(){
            var state = !$(this).find("input[type='checkbox']").is(":checked");
            
            if(state===false){
                $(".hire-status").find(".hire-status-false").removeClass("hide")
                $(".hire-status").find(".hire-status-true").addClass("hide")
            }
            else{
                $(".hire-status").find(".hire-status-false").addClass("hide")
                $(".hire-status").find(".hire-status-true").removeClass("hide")
            }
       })

       $("#submit").click(function(){
            $.post("/user/register/new", {
                first_name:$("#first_name").val(),
                last_name:$("#last_name").val(),
                bio:$("#bio").val(),
                for_hire:$("#for-hire").is(":checked"),
                email:$("#email").val(),
                username:$("#username").val(),
                password:$("#password").val()
            }, function(pass){
                if(pass){
                    
                }
                else{

                }
            })
       })
    }
})