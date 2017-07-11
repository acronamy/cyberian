import * as cheerio from "cheerio";

function injectAt(url:string, callback:Function){
    if(this.req.baseUrl === url){
        callback();
    }
}

export function injector(err, html){
  
    const $ = cheerio.load(html);
    //head
    $("head").append('<script src="http://localhost:35729/livereload.js"></script>');
    $("head").append(`<title>${this.name} | ${this.req.url.replace("/","")}</title>`);
    $("head").append("<link rel='stylesheet' type='text/css' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'/>")

    //shared across both mounts
    //be carefull, if one sass sheet is meant to be in on one mount do not include in both sheets.
    $("head").append("<link rel='stylesheet' type='text/css' href='styles/cyberian-common.css'/>")

    injectAt.bind(this)("",function(){
        $("head").append("<link rel='stylesheet' type='text/css' href='styles/cyberian-front.css'/>")
    })
    injectAt.bind(this)("/editor",function(){
        $("head").append("<link rel='stylesheet' type='text/css' href='styles/cyberian-admin.css'/>")
    })


    if(this.template){
        console.log(this.template)
        const templateParent = $("#"+this.template).parent()
        templateParent.append($("#"+this.template).html())
    }

    if(this.template==="profile"){
        $("#user-hero").css({
            "background-image":`url(${this.cover})`
        })
    }

    if(this.template==="collections"){
        $("body").addClass("editor")
        $(".folder-tree").append("<h5>Collections</h5>")
        this.collections.forEach(collection => {
            $(".folder-tree").append(
                `<div data-id="${collection.id}" class="folder-row clearfix"> 
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
                    ${collection.photoContents.map(photo=>{
                        return `<li class="list-group-item" data-id='${photo.ref}'><div style="background-image:url('${photo.url}');" class="photo-thumbnail"></div> ${photo.url.split("/").pop()}</li>`
                    }).join("")}
                </ul>
                `
            )

            $(".collections-real").append(
                `<div id="collection-${collection.id}" class="editor-collection-panel">
                    <header class="editor-collection-meta">
                        <h3 class="h1 editor-collection-name">${collection.name}</h3>
                        
                        <p class="editor-collection-description">${collection.description}</p>
                        <span class="editor-collection-tags">${collection.tags.split(",").map(tag=>`<span class="tag label label-info editor-collection-tags">${tag}</span>`).join("")}</span>
                    </header>
                    <main class="clearfix">
                        <div class="rail">
                            ${collection.photoContents.map(photo=>{
                                return `<div style="background-image:url('${photo.url}');" title='${photo.description}'
                                data-url="${photo.url}"
                                data-ref="${photo.ref}"
                                data-description="${photo.description}"
                                data-index="${photo.index}"
                                data-public="${photo.enable}"
                                class='editor-collection-photo'></div>`
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
                        <div class="modal-content">
                            <header class="modal-header">
                                <h4>Create Collection</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                            </header>
                            <aside class="col-xs-2">
                                <form>
                                    <div class="form-group collection-group">
                                        <input required class="form-control collection-name" type="text" value="${collection.name}" placeholder="Collection name"/>
                                        <textarea value="${collection.description}" required class="form-control collection-description" placeholder="Description" size="2"></textarea>
                                        <h5>Tags</h5>
                                        <input value="${collection.tags}" id="collection-tags" class="form-control" data-role="tagsinput" />
                                    </div>
                                </form>
                            </aside>
                            <main class="col-xs-10">
                                <div class="add-placeholder tile">
                                    <input type="file" class='photo-upload-target'/>
                                </div>
                                ${collection.photoContents.map(photo=>{
                                    return `<div style="background-image:url('${photo.url}');" title='${photo.description}'
                                    data-url="${photo.url}"
                                    data-ref="${photo.ref}"
                                    data-description="${photo.description}"
                                    data-index="${photo.index}"
                                    data-public="${photo.enable}"
                                    class='tile photo-tile'></div>`
                                }).join("")}
                            </main>
                            <footer class="modal-footer col-xs-10" class="clearfix">
                                <button disabled data-dismiss="modal" id="collection-save" type="button" class="btn btn-primary pull-right"><span class="glyphicon glyphicon-ok"></span> Save</button>
                            </footer>
                        </div>
                    </div>
                </div>
                `
            )
        });


        $(".folder-tree").append("<h5>Dropbox <small>(read only)</small></h5>")
        this.dropbox.folders.forEach(function(folder){
            const safeId = folder.path_lower.split("/").pop().replace(/[-|\s]/g,"_")

            $(".folder-tree").append(`
                <div data-id="${folder.id}" data-path="${folder.path_lower}" class="folder-row dropbox clearfix pending" data-toggle="collapse" data-target="#collection-dropbox-folder-list-${safeId}">
                    <div class="folder folder-dropbox"></div> <h4>${folder.name}</h4> <div class="hide spinner"></div>
                </div>

                <ul data-path="${folder.path_lower}" class="list-group collapse" id="collection-dropbox-folder-list-${safeId}">
                    
                </ul>
            `)
            


        })
        

    }

    //Login conditional
    if(this.session){
        $("body").addClass("logged-in");
        $("body").prepend(`<div id="page-top"></div>`);
    }

    //Eternal libraries
    $("body").append('<script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>');
    //Front page
    injectAt.bind(this)("",function(){
        $("body").append("<script src='scripts/cyberian-common.bundle.js'></script>")
        $("body").append("<script src='scripts/cyberian-main.bundle.js'></script>")
    })
    injectAt.bind(this)("/editor",function(){
        $("body").append("<script src='scripts/cyberian-common.bundle.js'></script>")
        $("body").append("<script src='scripts/cyberian-main.bundle.js'></script>")
    })


    if(err){
        this.render("error")
    }
    else{
        this.send($.html())
    }
}