import * as $ from "jquery";
import * as moustrap from "mousetrap";

$(function () {
    if ($("body").hasClass("page-login") && $("body").find(".wrapper-login").length > 0) {

        moustrap.bind("enter", function () {

            /**
             * If password is in place allow submit on enter.
            */
            if ($("#username").val() !== "") {
                //$("#username").parent().removeClass("error");
                $.post("/user/login", {username:$("#username").val(), password:$("#password").val()}, function(userInstance) {
                    if(userInstance){
                        rememberMe(userInstance)
                        window.location = "/"
                    }
                    else{
                        console.log("user or password wrong")
                    }
                })
            }
            else{
                $("#username").parent().addClass("error");
            }

        })

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

        function setAvatar(userInstance){
            if(userInstance){
                $(".avatar").addClass("found")
            }
            else{
                $(".avatar").removeClass("found")
            }
            if(isSVGAvatar(userInstance.avatar)){
                //inline svg
                $(".avatar-inner").css({
                    backgroundImage:"url('data:image/svg+xml;utf8,"+userInstance.avatar+"')"
                })
                .addClass("show");
            }
            else{
                //image
                $(".avatar-inner").css({
                    backgroundImage:"url('"+userInstance.avatar+"')"
                })
                .addClass("show");
            }
        }
        function rememberMe(userInstance){
            localStorage.setItem("user",JSON.stringify(userInstance))
        }
        function forgetMe(){
            localStorage.removeItem("user");
        }
        function getMe(){
            return JSON.parse(localStorage.getItem("user"));
        }

        function unsetAvatar(){
            $(".avatar").removeClass("found")
            $(".avatar-inner").removeClass("show");
        }

        /**
         * Regardless of if user has local storage set, set the event listener to load user image
        */
        $("#username").on("blur", function(){
            /**
             * Find a username
            */
            $.post("/user/login/check-user", {username: $(this).val()}, function (userInstance) {
                if(userInstance){
                    setAvatar(userInstance);
                    rememberMe(userInstance);
                }
            })
        })

        //user has logged in
        if(getMe()){
            const userInstance = getMe();
            console.log(userInstance)
            $(".returning-user-ctrl").removeClass("hide");
            $("#username").val(userInstance.username);
            $("#returning-user-name").text(userInstance.first_name+" "+userInstance.last_name)
            $("#password").focus();
            console.log(userInstance)
            setAvatar(userInstance);
        }
        //no local storage on my username
        else{
            $("#username-group").removeClass("hide");
            $("#username").focus();
        }

        
        $("#returning-user-name-cancel").click(function(){
            forgetMe();
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