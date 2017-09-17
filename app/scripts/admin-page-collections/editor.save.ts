var url;
var data;

export function postSimpleSaveMode(){
    url = "/save/collection";
    data = {
        name: $("#quick-add-collection").val(),
        description: "",
        tags: "",
        photoContents: "[]",
        enabled: true
    };

    return data;
}

export function postSaveMode(collection){
    url = "/save/collection";
    data = {
        name: $("#collection-name").val(),
        description: $("#collection-description").val(),
        tags: $("#collection-tags").val(),
        photoContents: JSON.stringify(collection),
        enabled: true
    };

    return data;
}