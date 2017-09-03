
import {loadDropboxFolderContent, dbx} from "./load-dropbox";
import { spinner, showFolderSpinner } from "./spinner";

export async function loadDropboxPhotos(){

    

    if($(this).hasClass("pending")){
        var self = $(this);
        var path = $(this).data("path");
        var previousCache = localStorage.getItem(path);
        self.removeClass("pending");
        self.addClass("loaded");
        //load content
        spinner.show(self);
        var cache = {};
        var filesRes = await loadDropboxFolderContent(path);
        
        if(filesRes.length === 0){
            $(this).next("ul").addClass("no-content")
        }

        filesRes.forEach(async file => {
            var ext = file.name.split(".").pop()
            var usable = (ext === "jpg" || ext === "jpeg" || ext === "png");
            var saved = localStorage.getItem(file.id+"_saved")||false;

            $(this).next("ul").append(`
<li data-name="${file.name}" data-path="${file.path_display}" data-id="${file.id}" class="list-group-item ${saved?"saved":""} ${usable?"valid":"invalid"}">
    <div class="loader"></div> <div class="photo-thumbnail"></div>
    ${file.name} 
    <span class="status pull-right"> 
        <span title="Download" class="fa fa-cloud-download download"></span>
        <i title="File saved" class="text-success local-copy hide fa fa-check" aria-hidden="true"></i>
        <i title="File unreachable" class="warning hide fa text-warning fa-exclamation-triangle" aria-hidden="true"></i>
    </span>
</li>`)
            var item = $("[data-id='"+file.id+"']")

            var thumb = await dbx.filesGetThumbnail({path:file.path_display});
            var img = document.createElement('img');
            var reader = new FileReader();
            reader.readAsDataURL(thumb.fileBlob);

            reader.onloadend = function() {
                var base64data = reader.result;
                cache[file.id] = base64data;
                item.addClass("valid")
                
                item.find(".photo-thumbnail").css({backgroundImage:`url('${base64data}')`})
            }
        });

        spinner.hide(self);
    }
    
}