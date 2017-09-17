"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//Polyfills
require("reflect-metadata");
const yargs_1 = require("yargs");
const mounts_index_1 = require("./mounts.index");
const install_1 = require("./install");
const middleware_config_1 = require("./config/middleware.config");
//App: Routing
const front_get_1 = require("./routes/front/front.get");
const editor_get_1 = require("./routes/editor.get");
const collection_post_1 = require("./routes/collections/collection.post");
const user_get_1 = require("./routes/user/user.get");
const user_post_1 = require("./routes/user/user.post");
const design_get_1 = require("./routes/design/design.get");
//Feeds
const collection_feed_1 = require("./routes/collections/collection.feed");
const photo_feed_1 = require("./routes/collections/photo.feed");
const design_feed_1 = require("./routes/design/design.feed");
const design_post_1 = require("./routes/design/design.post");
//App: Database
const database_1 = require("./database");
console.log("\nServer started\n");
database_1.database.then((connection) => __awaiter(this, void 0, void 0, function* () {
    console.log("Database connection established: " + connection.isConnected);
    yield install_1.installSite(connection, mounts_index_1.main, mounts_index_1.editor);
    //Middleware ect
    middleware_config_1.configure(mounts_index_1.main, mounts_index_1.editor);
    //Routes index
    front_get_1.frontRoute(mounts_index_1.main, connection);
    editor_get_1.collectionsRoute(mounts_index_1.editor, connection);
    collection_post_1.postCollection(mounts_index_1.main, connection);
    collection_post_1.postCollectionPhoto(mounts_index_1.main, connection);
    //User: GET
    user_get_1.userRoute(mounts_index_1.main, connection);
    user_get_1.userRegisterRoute(mounts_index_1.main, connection);
    //User: POST
    user_post_1.userRegisterPostRoute(mounts_index_1.main, connection);
    user_post_1.userLoginPostRoute(mounts_index_1.main, connection);
    user_post_1.userLogoutPostRoute(mounts_index_1.main, connection);
    user_post_1.userLogoutPostRoute(mounts_index_1.editor, connection);
    user_post_1.userCheckPostRoute(mounts_index_1.main, connection);
    design_get_1.designGet(mounts_index_1.editor, connection);
    collection_feed_1.collectionFeed(mounts_index_1.main, connection);
    photo_feed_1.photoFeed(mounts_index_1.main, connection);
    design_post_1.postDesignUpdate(mounts_index_1.main, connection);
    design_feed_1.designFeed(mounts_index_1.main, connection);
}))
    .catch(err => {
    if (err) {
        console.log(err);
    }
});
mounts_index_1.main.listen(yargs_1.argv.port);
