"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createFolderTree($) {
    this.collections.forEach(collection => {
        $(".folder-tree").append(`<div data-id="${collection.id}" class="folder-row clearfix"> 
            <div data-toggle="collapse" data-target="#collection-folder-list-${collection.id}" data-length="${collection.photoContents.length}" class="folder"></div> <h4 data-toggle="collapse" data-target="#collection-folder-list-${collection.id}">${collection.name}</h4>

            <div class="dropdown pull-right">
                <button class="btn btn-default dropdown-toggle" type="button" id="collection-folder-context-${collection.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    <span class="glyphicon glyphicon-option-horizontal"></span>
                </button>
                <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="collection-folder-context-${collection.id}">
                    <li><a data-toggle="modal" data-target="#edit-collection-${collection.id}" data-action="edit" href="#">Edit</a></li>
                    <li role="separator" class="divider"></li>
                    <li><a data-collection="${collection.id}" data-action="delete" data-toggle="modal" data-target="#modal-collection-delete-${collection.id}" data-action="delete" href="#">Delete</a></li>
                </ul>
            </div>
        </div>
        <ul id="collection-folder-list-${collection.id}" class="list-group  collapse collection-photo-list">
            ${collection.photoContents.map(photo => {
            return `<li class="list-group-item valid" data-id='${photo.ref}'><div style="background-image:url('${photo.url}');" class="photo-thumbnail"></div> ${photo.url.split("/").pop()}</li>`;
        }).join("")}
        </ul>
        `);
        $(".collections-real").append(`<div id="collection-${collection.id}" class="editor-collection-panel">
            <header class="editor-collection-meta">
                <h3 class="h1 editor-collection-name">${collection.name}</h3>
                
                <p class="editor-collection-description">${collection.description}</p>
                <span class="editor-collection-tags">${collection.tags.split(",").map(tag => `<span class="tag label label-info editor-collection-tags">${tag}</span>`).join("")}</span>
            </header>
            <main class="clearfix">

                <!-- Wrapper for slides -->    
                <div data-slider id='slider-${collection.id}'
                    data-xs-show="1" 
                    data-sm-show="1" 
                    data-md-show="3"
                    data-lg-show="3"
                    data-theme='#000'
                >
                    ${collection.photoContents.map((photo, i) => {
            return `<img src="${photo.url}" title='${photo.description}'
                                        data-url="${photo.url}"
                                        data-ref="${photo.ref}"
                                        data-description="${photo.description}"
                                        data-index="${photo.index}"
                                        data-public="${photo.enable}"
                                        class='editor-collection-photo ${photo.orientation}'/>`;
        }).join("")}
                </div>

                
                

            

            </main>
            <footer class="editor-collection-controls clearfix">
                <button data-collection="${collection.id}" data-action="delete" data-toggle="modal" data-target="#modal-collection-delete-${collection.id}" type="button" class="btn btn-link pull-right">Delete</button>
                <button data-collection="${collection.id}" data-toggle="modal" data-target="#edit-collection-${collection.id}" data-action="edit" type="button" class="btn btn-link pull-right">Edit</button>
            </footer>
        </div>
        
        <!--Delete Modal-->
        <div class="modal fade modal-delete-collection" id="modal-collection-delete-${collection.id}" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                
                
                <div class="modal-body">
                    <p>Are you sure you want to delete the collection: <b>${collection.name}</b>?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-link" data-dismiss="modal">Cancel</button>
                    <button type="button" data-action="delete" data-dismiss="modal" data-collection="${collection.id}" class="btn btn-link">Delete</button>
                </div>
                </div>
            </div>
        </div>

        <!--Edit modal-->
        <div class="modal fade edit-collection" id="edit-collection-${collection.id}" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
            <div class="modal-dialog modal-lg" role="document">
                <form id='edit-collection' data-id='${collection.id}' action="/save/collection">
                    <div class="modal-content">
                        <header class="modal-header">
                            <h4>Create Collection</h4>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                        </header>
                        <aside class="col-xs-2">
                            <div class="form-group collection-group">
                                <input novalidate id="collection-name-${collection.id}" class="form-control collection-name" type="text" value="${collection.name}" placeholder="Collection name"/>
                                <textarea novalidate id="collection-description-${collection.id}" class="form-control collection-description" placeholder="Description" size="2">
${collection.description.replace(/^\s+|\s+$/g, '')}</textarea>
                                <h5>Tags</h5>
                                <input value="${collection.tags}" id="collection-tags" class="form-control" data-role="tagsinput" />
                            </div>
                        </aside>
                        <main class="col-xs-10">
                            <div class="add-placeholder tile">
                                <input type="file" class='photo-upload-target'/>
                            </div>
                            ${collection.photoContents.map(photo => {
            return `<div style="background-image:url('${photo.url}');" title='${photo.description}'
                                data-url="${photo.url}"
                                data-ref="${photo.ref}"
                                data-description="${photo.description}"
                                data-index="${photo.index}"
                                data-public="${photo.enable}"
                                
                                class='tile photo-tile orientation-${photo.orientation}'></div>`;
        }).join("")}
                        </main>
                        <footer class="modal-footer col-xs-10" class="clearfix">
                            <button id='save-${collection.id}' type='submit' class="btn btn-primary pull-right">
                                <span class='glyphicon glyphicon-ok'></span>
                                Save
                            </button>
                        </footer>
                    </div>
                </form>
            </div>
        </div>
        `);
    });
    $(".folder-tree").append("<h5>Dropbox <small>(read only)</small></h5>");
    this.dropbox.folders.forEach(function (folder) {
        const safeId = folder.path_lower.split("/").pop().replace(/[-|\s]/g, "_");
        $(".folder-tree").append(`
        <div data-id="${folder.id}" data-path="${folder.path_lower}" class="folder-row dropbox clearfix pending" data-toggle="collapse" data-target="#collection-dropbox-folder-list-${safeId}">
            <div class="folder folder-dropbox"></div> <h4>${folder.name}</h4> <div class="hide spinner"></div>
        </div>

        <ul data-path="${folder.path_lower}" class="list-group collapse dropbox-photo-list" id="collection-dropbox-folder-list-${safeId}">
            
        </ul>
    `);
    });
}
exports.createFolderTree = createFolderTree;
