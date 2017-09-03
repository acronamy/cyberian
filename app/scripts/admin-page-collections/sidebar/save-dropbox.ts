import {loadDropboxFolderContent, dbx} from "./load-dropbox";

export async function saveDropbox(){
    var listItem = $(this).closest(".list-group-item");

    var id = listItem.data("id");
    var path = listItem.data("path");
    var loader = listItem.find(".loader");
    var name = listItem.data("name");

    //presnt download
    
    listItem.addClass("downloading");
    loader.removeClass("hide");
    
    //start download
    var download;
    try{
        download = await dbx.filesDownload({path:path});
        success(download);
    }
    catch(err){
        if(err){
            error(err);
        }
    }
    
    function success(download){
        if("fileBlob" in download){

            function blobToBase64(blob, cb) {
                var reader = new FileReader();
                reader.onload = function() {
                    var dataUrl = reader.result;
                    var base64 = dataUrl.split(',')[1];
                    cb(base64);
                };
                reader.readAsDataURL(blob);
            };

            blobToBase64(download.fileBlob,function(base64){
                $.post("/save/dropbox-photo", { imageData:base64, filename:name } ,function(res){
                    if(res){
                        loader.css({height:"0px",marginBottom:"0px"});
                        listItem.find(".local-copy").removeClass("hide");
                        listItem.removeClass("downloading");
                        listItem.addClass("saved");
                        //cache saved
                        localStorage.setItem(id+"_saved",JSON.stringify({
                            date:(new Date()).toString(),
                            name:name
                        }))
                    }
                    else{
                        error("Could not write dropbox file");
                    }
                })
                .fail(function(err) {
                    if(err){
                        error("Could not post dropbox file");
                    }
                })
            })
            
        }
        else{
            error("No blob in download");
        }
    }
    function error(err){
        console.log("Dropbox save error:\n",err)
        
        loader.css({height:"0px",marginBottom:"0px"});
        listItem.removeClass("downloading");
        listItem.addClass("error");
        //show warning trinagle icon
        listItem.find(".warning").removeClass("hide");
    }
}