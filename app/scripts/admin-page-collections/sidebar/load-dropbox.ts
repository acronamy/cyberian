var Dropbox = require("dropbox");
var dbx = new Dropbox({ accessToken: '9x3oXu1QUfAAAAAAAAAQhpuxPKAV8iQfdN3ZljlNfCaf9WCY2TBxWly8WymlraLV' });

export async function loadDropboxFolderContent(path){
    const  dbxPathContent = await dbx.filesListFolder({path: path})
    const folders = dbxPathContent.entries.filter(folder=>folder[".tag"]==="file");
    return folders;
}

export {dbx}