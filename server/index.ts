//Polyfills
import "reflect-metadata";
import { argv } from "yargs";
import { editor, main } from "./mounts.index";
import { installSite } from "./install";
import { configure } from "./config/middleware.config";

//App: Routing
import { frontRoute } from "./routes/front/front.get";
import { collectionsRoute } from "./routes/editor.get";
import { 
    postCollection, 
    postCollectionPhoto
} from "./routes/collections/collection.post";

import { 
    userRoute, 
    userRegisterRoute 
} from "./routes/user/user.get";

import { 
    userLoginPostRoute, 
    userLogoutPostRoute, 
    userRegisterPostRoute, 
    userCheckPostRoute 
} from "./routes/user/user.post";

import {
    designGet
} from "./routes/design/design.get"; 
//Feeds
import { collectionFeed } from "./routes/collections/collection.feed";
import { photoFeed } from "./routes/collections/photo.feed";
import { designFeed } from "./routes/design/design.feed";
import { postDesignUpdate } from "./routes/design/design.post";

//App: Database
import { database } from "./database";

console.log("\nServer started\n")

database.then(async connection=>{
    console.log("Database connection established: "+connection.isConnected)
    await installSite(connection, main, editor);

    //Middleware ect
    configure(main, editor);
    
    //Routes index
    frontRoute(main, connection);
    collectionsRoute(editor, connection);
    postCollection(main, connection);
    postCollectionPhoto(main, connection);
    //User: GET
    userRoute(main, connection);
    userRegisterRoute(main, connection);
    //User: POST
    userRegisterPostRoute(main, connection);
    userLoginPostRoute(main, connection);
    userLogoutPostRoute(main, connection);
    userLogoutPostRoute(editor, connection);
    userCheckPostRoute(main, connection);
    designGet(editor, connection);
    collectionFeed(main, connection);
    photoFeed(main, connection);
    postDesignUpdate(main, connection);

    designFeed(main, connection);
})
.catch(err=>{
    if(err){
        console.log(err)
    }
})

main.listen(argv.port);