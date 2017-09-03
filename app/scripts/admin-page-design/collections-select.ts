import * as tinyColor from "tinycolor2";
import {autosaveNotify} from "../admin-pages/autosave-notification";


if($("body").hasClass("page-design")){

    var autosave = new autosaveNotify()
    var postUrl = "/design/update";
    var demo = $(".demo");
    var fields = {
        //about me
        aboutMeBackgroundImage:$("[name='about-me-background-image']"),
        aboutMeBackgroundImageAlignment:$("[name='about-me-background-image-alignment']"),
        aboutMeHeading:$("[name='about-me-heading']"),
        aboutMeTextAlignment:$("[name='about-me-bio-alignment']"),
        aboutMeTextBio:$("[name='about-me-bio']"),
        //carousel
        carouselAutoScroll:$("[name='carousel-autoscroll']"),
        carouselIncludes:$("[name='carousel-includes']"),
        carouselSpeed:$("[name='carousel-speed']"),
        //contact me
        contactMeBackgroundImage:$("[name='contact-me-background-image']"),
        contactMeBackgroundImageAlignment:$("[name='contact-me-background-image-alignment']"),
        //photo galleries
        photoGaleryincludes:$("[name='photo-gallery-includes']"),
        //theme
        themeGeneralColor: $("#primary-color"),
        themePrimaryColor: $("#theme-color"),
        themeTextColor: $("#text-color")
    }

    console.log(fields)

    //Selects
    
    $(".axis").select2();
    $([
        fields.photoGaleryincludes,
        fields.carouselIncludes
    ]).attr("multiple","multiple")

    setTimeout(function(){
        console.log(window.CyberianPrepopulate)        
        $.get("/feed/collection",function(data){
            var data = data.map(function(collection){
                return {
                    text:collection.name,
                    id:collection.id
                }
            })
            $(".collection-select").each(function(){
                var prepopData = [];
                if($(this).attr("name") === "carousel-includes" ){

                    var toInclude = window.CyberianPrepopulate["carousel-includes"];

                    toInclude.split(",").forEach(function(id){
                        prepopData.push(data.find(item=>parseInt(item.id) === parseInt(id)))
                    });
                }
                if($(this).attr("name") === "photo-gallery-includes" ){
                    var toInclude = window.CyberianPrepopulate["photo-gallery-includes"];

                    toInclude.split(",").forEach(function(id){
                        prepopData.push(data.find(item=>parseInt(item.id) === parseInt(id)))
                    });
                }

                $(this).select2({
                    data:data,
                    initSelection: function (element, callback) {
                         //you can replace this by a second ajax call to get your initial data
                        if(prepopData.filter(Boolean).length > 0){
                            callback(prepopData);
                        }
                    }
                });
            })
        })
    })

    
    
    //Colors: on load or change
    $([
        fields.themePrimaryColor,
        fields.themeGeneralColor,
        fields.themeTextColor
    ])
    .each(function(){
        updateDemo.bind($(this))();
        $(this).change(updateDemo)
    })

    function saveField(target){
        //multiple values
        if( Array.isArray( target.val() ) ){
            return {
                name:target.attr("name"),
                value:target.val().join(",")
            }
        }
        else{
            return {
                name:target.attr("name"),
                value:target.val()
            }
        }
    }

    function updateDemo(e){
        var id = $(this).attr("id");
        if(id === "primary-color"){
            demo.find("h1").css({
                color: $(this).val()
            })
        }
        else if(id === "theme-color"){
            
            demo.css({
                background: $(this).val()
            })
            demo.find("p").css({
                color: lumColor($(this).val())
            })
            fields.themeTextColor.val(lumColor($(this).val()));
            fields.themeTextColor.trigger("change");
        }

        if(e){
            var self = $(this);
            $.post(postUrl,saveField(self),function(res){
                console.log(self.attr("name")+" saved");
            })
        }
    }

    function lumColor(target){

        var isReadable = tinyColor.isReadable(target, "#ffffff",{level:"AA"});
            
        if(isReadable){
            return "#ffffff";
        }
        else{
            return "#000000";
        }

    }


    // //set primary color
    // function primary(){
    //     $(".demo").find("h1").css({
    //         color:$("#primary-color").val()
    //     })
    // }

    // //setup demo
    // function demoMake(){
    //     $(".demo").css({
    //         backgroundColor: $("#theme-color").val(),
    //         color: $("#text-color").val()
    //     })
    //     primary()
    // }

    

    // primary()
    // autoColor.bind($("#primary-color"))();
    // fields.themePrimaryColor.on("change",function(){
    //     primary();
    //     var self = $(this);
    //     //POST
    //     $.post(postUrl,saveField($(self)),function(res){
    //         console.log($(self).attr("name")+" saved");
    //     })
    //     autosave.show();
    // });
    // fields.themeGeneralColor.on("change",function(){
    //     var self = $(this);
    //     autoColor(self);
    //     //POST
    //     $.post(postUrl,saveField($(self)),function(res){
    //         console.log($(self).attr("name")+" saved");
    //     })
    //     autosave.show();
    // });

    // //set colors on load
    // demoMake()


    $("input, select, textarea").on("change",function(){
        var self = $(this);
        autosave.show()

        //checkboxes
        if(self.attr("type") === 'checkbox'){
            $.post(postUrl,Object.assign(saveField(self),{value:self.is(":checked")}),function(res){
                console.log(self.attr("name")+" saved");
            })
        }
        //anything else
        else{
            $.post(postUrl,saveField(self),function(res){
                console.log(self.attr("name")+" saved");
            })
        }
    })


}