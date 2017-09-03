import * as $ from "jquery";


var root = $(".carousel");


if(root.length > 0 && location.pathname !== "/editor/collections"){

    var target = $(".carousel-inner");
    var carouselSettings = window.CyberianSettings['carousel'];
    var carouselIncludes = window.CyberianPrepopulate['carousel-includes'];
    var template = (url, active)=> {

    if(carouselSettings.autoscroll > 0){
        root.data('interval',carouselSettings.speed*1000)
    }


        var isActive = active?"active":"";
        return [
            "<div class='item "+isActive+"' >",
                "<img src='"+url+"'/>",
            "</div>"
        ].join("")
    }
    function collectionsFeed(id){
        return "/feed/collection/"+id+"/contents";
    }

    setTimeout(function(){
        console.log("inc",carouselIncludes.split(","))
        carouselIncludes.split(",").forEach(function(id){
            $.get(collectionsFeed(id),function(data){
                
                console.log("d",data)

                if(data){
                    data.forEach((photo,i) => {
                        var isActive = i===0?true:false;
                        $.get("/feed/photo/"+photo.ref,function(data){
                            target.append(template(data.url, isActive))
                        })
                    });
                }
            })
        })
        
    },300)
    

}