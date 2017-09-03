import * as $ from "jquery";
import {isSVGAvatar} from "../common/utils";

const avatarTemplate = (avatar)=>{
    if(isSVGAvatar(avatar)){
        return "url('data:image/svg+xml;utf8,"+avatar+"')";
    }
    else{
        return `${avatar}`;
    }
}

const template = (userInstance)=> `
<div class="sticky-placeholder">
<nav id="admin-toolbar" class="navbar navbar-inverse">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        ${window.location.pathname!=="/"? '<li id="back-to-site" title="back to site"><a href="/"><span class="glyphicon glyphicon-menu-left"></span></a></li>':""}
        <li><a href="/editor/collections">Collections</a></li>
        <li><a href="/editor/design">Design</a></li>
      </ul>

      <!--USER-->
      <ul class="nav navbar-nav navbar-right navbar-user">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle clearfix" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> 
            <span class="toolbar-username">${userInstance.first_name} ${userInstance.last_name}</span>
            <span class="toolbar-avatar"></span>
          </a>
          <ul class="dropdown-menu">
            <li role="separator" class="divider"></li>
            <li><a href="#">Log out</a></li>
          </ul>
        </li>
      </ul>

    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

<div class="progress">
  <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
    <span class="sr-only">60% Complete</span>
  </div>
</div>

</div>

`

window.addEventListener("load", function(){
    setTimeout(function(){
        $("#page-top").find(".sticky-placeholder").css({
            height:$("#page-top").find("#admin-toolbar").outerHeight()+"px",
            position:"relative",
            width:"100%"
        })
    },1)
});

$(function(){
    
    if($("#page-top").length>0){
        var userInstance = JSON.parse(localStorage.getItem("user"));

        $("#page-top").append(template(userInstance));


        $("#page-top").find(".toolbar-avatar").css({
            backgroundImage: avatarTemplate(userInstance.avatar)
        })
        
        //Actions
        $("[href='#logout']").click(function(e){
            e.preventDefault();
            $.post("/user/logout",function(){

                window.location = "/";
            })
        })


    }
})