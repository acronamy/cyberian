var BootstrapMenu = require('bootstrap-menu');

import { loadDropboxFolderContent, dbx } from "./load-dropbox";
import { saveDropbox } from "./save-dropbox";
import { unselectAdjacentFolder } from "./sidebar-selection";
import { forgetDropbox } from "./forget-dropbox";

let pasteFromDropbox = false;
export function contextMenus(clipboard) {
    //SIDEBAR
    const menu = new BootstrapMenu('.collection-photo-list .list-group-item', {
        actionGroups: [
            ["copy", "paste"],
            ["delete"]
        ],
        fetchElementData: function ($rowElem) {
            return $rowElem;
        },
        actions: {
            delete: {
                name: "Delete",
                onClick(el) {
                    $(".list-group-item.selected").remove();
                }
            }
        }
    });

    /**
     * DROPBOX
    */
    const dropboxMenu = new BootstrapMenu('.dropbox-photo-list .list-group-item', {
        fetchElementData: function ($rowElem) {
            return $rowElem;
        },
        actions: {
            save: {
                name: "Download",
                onClick(el) {
                    clipboard = []
                    $(el).siblings(".saved").removeClass("selected");
                    $(".list-group-item.selected").each(function (index) {
                        
                        saveDropbox.bind($(this).find(".download"))()
                    })

                },
                isShown: function(el) {
                    
                    return !$(el).hasClass("saved")
                }
            },
            copy: {
                name: "Copy",
                onClick(el) {
                    pasteFromDropbox = true;
                    clipboard = []
                    //clear non saved items, they cannot be coppied in this way
                    $(el).siblings().not(".saved").removeClass("selected");
                    $(".list-group-item.selected.saved").each(function (index) {
                        clipboard[index] = {
                            id: $(el).data("id"),
                            html: $(this)[0].outerHTML
                        };
                    })
                    console.log(clipboard)

                    
                },
                isShown: function(el) {
                    //disallow if selecting non downloaded items
                    var saveSelected = $(el).parent().find(".selected.saved");
                    var someSavedSelected = saveSelected.length > 0;
                    return $(el).hasClass("saved") || someSavedSelected;
                },
                isEnabled: function(el) {
                    //disallow if selecting non downloaded items
                    var saveSelected = $(el).parent().find(".selected.saved");
                    var noSavedSelected = saveSelected.length < 0;
                    return $(el).hasClass("saved") || noSavedSelected;
                }
            },
            forget:{
                name:"Delete",
                isShown(el){
                    return $(el).hasClass("saved");
                },
                onClick(el){
                    var saveSelected = $(el).parent().find(".selected.saved");
                    saveSelected.each(function(){
                        forgetDropbox.bind($(this))()
                    })
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
                isShown(el) {
                    if (clipboard.length > 0 && !$(el).hasClass("dropbox")) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                onClick(el) {
                    var pasteContent = clipboard.map(function (item) {
                        return item.html;
                    })

                    $(el).next().find(".selected").remove();

                    pasteContent.forEach(function (item) {
                        $(el).next().append(item);
                    })
                    clipboard = [];

                    setTimeout(function(){
                        $(el).next(".collection-photo-list").find(".saved .status").remove();
                        $(el).next(".collection-photo-list").find(".saved").removeClass("saved")
                        unselectAdjacentFolder($(el).next(".collection-photo-list").find(".selected").first())
                    },100)
                }
            },
            delete: {
                name: "Delete",
                onClick(el) {
                    var selector = "#modal-collection-delete-"+$(el).data("id");

                    $(selector).modal()
                },
                isShown(el) {
                    if (!$(el).hasClass("dropbox")) {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
            },
            dowloadAll: {
                name: "Download all",
                onClick(el) {
                    var unsaved = $(el).next(".dropbox-photo-list").find(".list-group-item").not(".saved");
                    unsaved.each(function(){
                        saveDropbox.bind($(this).find(".download"))()
                    })
                },
                isShown(el) {
                    var savedItemsLen = $(el).next(".dropbox-photo-list").find(".list-group-item.saved").length;
                    var allItemsLen = $(el).next(".dropbox-photo-list").find(".list-group-item").length;
                    var canDownloadAll = savedItemsLen !== allItemsLen
                    if ($(el).hasClass("dropbox") && canDownloadAll) {
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
