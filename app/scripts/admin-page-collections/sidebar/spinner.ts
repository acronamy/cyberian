export var spinner = {
    show(target){
        $(target).addClass("loading")
        $(target).find(".spinner").removeClass("hide")
    },
    hide(target){
        $(target).removeClass("loading")
        $(target).find(".spinner").addClass("hide")
    }
}

export function showFolderSpinner(){
    $(this).addClass("loading")
    $(this).find(".spinner").removeClass("hide")
}