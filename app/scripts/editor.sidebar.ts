import * as $ from "jquery";
import * as mousetrap from "mousetrap";

var Dropbox = require("dropbox")
var BootstrapMenu = require('bootstrap-menu');
var dbx = new Dropbox({ accessToken: '9x3oXu1QUfAAAAAAAAAQhpuxPKAV8iQfdN3ZljlNfCaf9WCY2TBxWly8WymlraLV' });

async function loadDropboxFolderContent(path){
    const  dbxPathContent = await dbx.filesListFolder({path: path})
    const folders = dbxPathContent.entries.filter(folder=>folder[".tag"]==="file");

    return folders;
}

var spinner = {
    show(target){
        $(target).addClass("loading")
        $(target).find(".spinner").removeClass("hide")
    },
    hide(target){
        $(target).removeClass("loading")
        $(target).find(".spinner").addClass("hide")
    }
}

function showFolderSpinner(){
    $(this).addClass("loading")
    $(this).find(".spinner").removeClass("hide")
}

export function sidebar() {

    //preload dropbox content
    
    $(".folder-row.dropbox").click(async function(){

        if($(this).hasClass("pending")){
            var self = $(this);
            var path = $(this).data("path");
            
            self.removeClass("pending");

            //load content
            spinner.show(self);
            var filesRes = await loadDropboxFolderContent(path);
            

            for(var file of filesRes){

                var ext = file.name.split(".").pop()
                
                $(this).next("ul").append(`<li data-id="${file.id}" class="list-group-item"> <div class="hide loader"></div> <div class="photo-thumbnail"></div> ${file.name} <span class="status pull-right"><span class="glyphicon glyphicon-download-alt download"></span> <span class="spinner"></span> <span class="glyphicon glyphicon-ok"></span></span> </li>`)

                if(localStorage.getItem(file.id)){
                    $(`[data-id="${file.id}"]`).addClass("valid")
                    $(`[data-id="${file.id}"]`).find(".photo-thumbnail").css({backgroundImage:`url('${localStorage.getItem(file.id)}')`})
                }
                else{
                    if(ext === "jpg" || ext === "jpeg" || ext === "png"){
                        var thumb = await dbx.filesGetThumbnail({path:file.path_display});
                        var img = document.createElement('img');
                        var reader = new FileReader();
                        reader.readAsDataURL(thumb.fileBlob); 
                        reader.onloadend = function() {
                            var base64data = reader.result;
                            localStorage.setItem(file.id, base64data);
                            $(`[data-id="${file.id}"]`).addClass("valid")
                            $(`[data-id="${file.id}"]`).find(".photo-thumbnail").css({backgroundImage:`url('${base64data}')`})
                        }
                    }
                }

                
            }

            spinner.hide(self);
        }
        // var path = $(this).data("path");
        // var id = $(this).data("id")
        // var list = self.next("ul[data-path='"+path+"']");

        // //thumbnails - localcaching

        // if(localStorage.getItem(id)){
            
        //     $(`[data-id="${id}"]`).find(".photo-thumbnail").css({backgroundImage:`url('${localStorage.getItem(id)}')`})
        // }
        // else{
        //     filesRes.forEach(async function(res){
        //         if(Array.isArray(res)){
        //             console.log(res)
        //         }
        //         else{
        //             var ext = res.name.split(".").pop();
        //             if(ext === "jpg" || ext === "jpeg" || ext === "png"){
        //                 var thumb = await dbx.filesGetThumbnail({path:res.path_display});
        //                 var img = document.createElement('img');
        //                 var reader = new FileReader();
        //                 reader.readAsDataURL(thumb.fileBlob); 
        //                 reader.onloadend = function() {
        //                     var base64data = reader.result;
        //                     localStorage.setItem(res.id, base64data);           
        //                     $(`[data-id="${res.id}"]`).find(".photo-thumbnail").css({backgroundImage:`url('${base64data}')`})
        //                 }

                        

        //             }
        //         }
        //     })
        // }

        // if($(list).children().length <= 0){
        //     $(`[data-path="${path}"]`).hide();
        // }

        //`<li data-path="${files.path}" data-id="${files.id}" class="list-group-item"> <div class="hide loader"></div> <div class="photo-thumbnail"></div> ${files.filename}<span class="glyphicon glyphicon-download-alt pull-right download"></span></li>`
    })

    $(document).on("click",".list-group-item .download",async function(){
        var listItem = $(this).parent();
        var path = listItem.data("path");
        var loader = listItem.find(".loader")

        loader.removeClass("hide");
        loader.siblings().addClass("hide");
        var download = await dbx.filesDownload({path:path});
        loader.addClass("hide");
        listItem.find(".glyphicon").replaceWith("<span class='glyphicon glyphicon-ok pull-right'></span> ")
        listItem.addClass("downloaded");
        loader.siblings().removeClass("hide");

        
        console.log(download.fileBlob)
    })


    function singleSelect(){
        $(document).off("mousedown");
        $(document).on("mousedown",".collection-photo-list .list-group-item",function(e){
            if(e.which === 1){//primary click
                $(this).addClass("selected")
                $(this).siblings().removeClass("selected");
            }
        })
    }

    singleSelect();

    //select of any
    mousetrap.bind('ctrl', (e)=> {
        $(document).off("mousedown");
        $(document).on("mousedown",".collection-photo-list .list-group-item",function(){
            if($(this).hasClass("selected")){
                $(this).removeClass("selected")
            }
            else{
                $(this).addClass("selected")
            }
            
        })
    },"keydown");

    mousetrap.bind('ctrl', (e)=> {
        singleSelect();
    },"keyup")

    mousetrap.bind('shift', (e)=> {
        $(document).off("mousedown");
        $(document).on("mousedown",".collection-photo-list .list-group-item",function(){
            $(this).addClass("selected")
            var selectIndex = $(this).index()
            var firstSelect = $(".selected").index()
            var direction = selectIndex  === firstSelect?"up":"down";

            if(direction === "down"){
                $(".collection-photo-list .list-group-item").each(function(index){
                if(index <= selectIndex && index >= firstSelect){
                    $(this).addClass("selected");
                }
            })
            }
            else if(direction === "up" && $(".list-group-item.selected").length > 1){
                $(this).nextUntil(".list-group-item.selected").addClass("selected")
            }
            
        })
    },"keydown");

    mousetrap.bind('shift', (e)=> {
        singleSelect();
    },"keyup")

    //SIDEBAR
    var clipboard = [];
    const menu = new BootstrapMenu('.collection-photo-list .list-group-item', {
        actionGroups: [
            ["copy", "paste"],
            ["delete"]
        ],
        fetchElementData: function ($rowElem) {
            return $rowElem;
        },
        actions: {
            copy: {
                name: "Copy",
                onClick(el) {
                    
                    $(".list-group-item.selected").each(function(index){
                        clipboard[index] = {
                            id: $(this).data("id"),
                            html: $(this)[0].outerHTML
                        };
                    })
                    
                    console.log(clipboard)
                }
            },
            paste: {
                name: "Paste",
                isEnabled: (el) => {
                    if (clipboard.length > 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                onClick(el) {
                    
                    var pasteContent = clipboard.map(function(item){
                        return item.html;
                    })

                    $(el).parent().find(".selected").remove();
                    
                    pasteContent.forEach(function(item){
                        $(el).parent().append(item);
                    })
                    clipboard = [];
                }
            },
            delete: {
                name: "Delete",
                onClick(el) {
                    $(".list-group-item.selected").remove();
                }
            }
        }
    });

    const folderMenu = new BootstrapMenu('.folder-row', {
        fetchElementData: function ($rowElem) {
            return $rowElem;
        },
        actions: {
            paste: {
                name: "Paste",
                isEnabled(el) {
                    if (clipboard.length > 0 && !$(el).hasClass("dropbox")) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                onClick(el) {
                    var pasteContent = clipboard.map(function(item){
                        return item.html;
                    })

                    $(el).next().find(".selected").remove();
                    
                    pasteContent.forEach(function(item){
                        $(el).next().append(item);
                    })
                    clipboard = [];
                }
            },
            delete: {
                name: "Delete",
                onClick() {

                },
                isEnabled(el) {
                    if (!$(el).hasClass("dropbox")) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
            }
        }
    })
}