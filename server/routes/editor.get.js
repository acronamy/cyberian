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
const utils_1 = require("../utils");
const main_injector_1 = require("./main.injector");
const collection_entity_1 = require("../entities/collection.entity");
const photo_entity_1 = require("../entities/photo.entity");
const Dropbox = require("dropbox");
const dbx = new Dropbox({ accessToken: '9x3oXu1QUfAAAAAAAAAQhpuxPKAV8iQfdN3ZljlNfCaf9WCY2TBxWly8WymlraLV' });
function collectionsRoute(mount, connection) {
    //login status
    mount.use("*", (req, res, next) => {
        if (!utils_1.isLoggedIn(req)) {
            res.redirect("/user");
        }
        else {
            next();
        }
    });
    mount.get("/collections", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const connectionsRepo = connection.getRepository(collection_entity_1.Collection);
        const photoRepo = connection.getRepository(photo_entity_1.Photo);
        const collections = yield connectionsRepo.find();
        for (let collection of collections) {
            let photos = JSON.parse(collection.photoContents);
            for (let photo of photos) {
                let loadedPhoto = yield photoRepo.findOne({ ref: photo.ref });
                photo.orientation = loadedPhoto.orientation;
                photo.url = loadedPhoto.url;
            }
            collection.photoContents = photos;
        }
        function loadDropboxFolder(path) {
            return __awaiter(this, void 0, void 0, function* () {
                const dbxPathContent = yield dbx.filesListFolder({ path: path });
                const folders = dbxPathContent.entries.filter(folder => folder[".tag"] === "folder");
                return folders;
            });
        }
        const renderOptions = {
            template: "collections",
            session: req.cookies.session || false,
            collections: collections,
            dropbox: {
                folders: yield loadDropboxFolder("/website")
            }
        };
        res.render("editor", {}, main_injector_1.injector.bind(Object.assign(res, mount.get("siteMetadata"), renderOptions)));
    }));
}
exports.collectionsRoute = collectionsRoute;
