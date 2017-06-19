import * as $ from "jquery";

$.fn.stick = function(options){
    var tt = $(this).offset().top;
    var target = $(this);
    var defaults = {
        to:0,
        cssCached:{
            width:"100%",
            top:$(this).css("top"),
            position:$(this).css("position"),
            "z-index":$(this).css("z-index"),
            height:$(this).outerHeight(),
            nextPaddingTop:target.next("*").css("padding-top")
        }
    }
    options = Object.assign(defaults, options);

    target.wrap("<div class='placeholder'></div>")
    
    target.parent().css({
        "height":options.cssCached.height,
        position:"relative"
    })

    if(typeof options.to === "object"){
        options.to = $(options.to).outerHeight()
    }

    $(window).on("scroll", function(e){
        var st = $(this).scrollTop() + options.to;
        if(st>=tt){
            target.css({
                position:"fixed",
                top:options.to+"px",
                "z-index":9999,
                width:"100%"
            })
        }
        else if(st<=tt){
            target.css(Object.assign(
                options.cssCached
            ));
        }
    })

}