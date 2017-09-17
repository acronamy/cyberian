import * as $ from "jquery";
import * as mousetrap from "mousetrap";
import {spinner, showFolderSpinner} from "./sidebar/spinner";
import { loadDropboxPhotos } from "./sidebar/sidebar-populate";
import { saveDropbox } from "./sidebar/save-dropbox";

import { singleSelect, multiSelectIndidual, multiSelectMultiple } from "./sidebar/sidebar-selection";
import { contextMenus } from "./sidebar/sidebar-context-menu";
import * as dragula from 'dragula';


export function sidebar() {

    //preload dropbox content
    
    $(".folder-row.dropbox").click( loadDropboxPhotos )

    $(document).on("click",".list-group-item .download", saveDropbox);

    //SIDEBAR: Selection
    singleSelect();
    multiSelectIndidual();
    multiSelectMultiple();


    $(".collection-photo-list").each(function(){
        dragula([ $(this)[0] ])
    })
    

    //SIDEBAR: Context right click menus
    var clipboard = [];
    contextMenus(clipboard)
}