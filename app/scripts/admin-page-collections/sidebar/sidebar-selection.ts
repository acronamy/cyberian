import * as mousetrap from "mousetrap";
import * as $ from "jquery";

var enableSelection = [
    ".collection-photo-list .list-group-item", 
    ".dropbox-photo-list .list-group-item"
].join(",")

export function unselectAdjacentFolder(el){
    $(el).parent().nextAll(".collection-photo-list, .dropbox-photo-list").find(".selected").removeClass("selected");
    $(el).parent().prevAll(".collection-photo-list, .dropbox-photo-list").find(".selected").removeClass("selected");
}

/**
 * Select sidebar items
*/
export function singleSelect(){
    $(document).off("mousedown");
    $(document).on("mousedown", enableSelection,function(e){
        
        if(e.which === 1){//primary click
            unselectAdjacentFolder($(this))
            $(this).addClass("selected")
            $(this).siblings().removeClass("selected");
        }
    })
}

/**
 * CTRL click to select multiple sidebar items
*/
export function multiSelectIndidual(){
    //ctrl modifier
    mousetrap.bind('ctrl', (e)=> {
        $(document).off("mousedown");
        $(document).on("mousedown", enableSelection,function(e){
            if(e.which === 1){//primary click
                unselectAdjacentFolder($(this))
                if($(this).hasClass("selected")){
                    $(this).removeClass("selected")
                }
                else{
                    $(this).addClass("selected")
                }
            }
        })
    })
    //cancel
    mousetrap.bind('ctrl', (e)=> {
        singleSelect()
    }, 'keyup')
}

/**
 * SHIFT click to select multiple sidebar items
*/
export function multiSelectMultiple(){
    //this modifer can be called before a selection or after, we dont need to check however.

    mousetrap.bind('shift', (e)=> {
        $(document).off("mousedown");
        $(document).on("mousedown", enableSelection,function(e){
            unselectAdjacentFolder($(this))
            $(this).addClass("selected")
            if($(this).parent().find(".selected").length >= 2){
                var firstI = $(this).parent().find(".selected").first().index();
                var lastI = $(this).parent().find(".selected").last().index();
                var between = $(this).parent().find("li").slice(firstI, lastI+1 );
                between.addClass("selected")
            }

        });
    },"keydown");

    mousetrap.bind('shift', (e)=> {
        singleSelect();
    },"keyup")
}