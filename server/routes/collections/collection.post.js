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
const utils_1 = require("../../utils");
const path = require("path");
const fs = require("fs");
const collection_entity_1 = require("../../entities/collection.entity");
const photo_entity_1 = require("../../entities/photo.entity");
const jsHash = require("jshashes");
const MD5 = new jsHash.MD5;
const saveFileDirDropbox = path.resolve(__dirname, "../uploads", "dropbox");
function postCollection(mount, connection) {
    mount.post("/save/collection", (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (utils_1.isLoggedIn(req)) {
            const collection = new collection_entity_1.Collection();
            const data = req.body;
            collection.description = data.description;
            collection.enabled = data.enabled;
            collection.name = data.name;
            collection.photoContents = data.photoContents;
            collection.tags = data.tags;
            yield connection.manager.persist(collection)
                .then(() => {
                console.log("collection saved");
            })
                .catch((err) => {
                if (err) {
                    console.log(err);
                }
            });
            res.send(true);
        }
    }));
    mount.post("/update/collection", (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (utils_1.isLoggedIn(req)) {
            const collection = connection.getRepository(collection_entity_1.Collection);
            const data = req.body;
            const collectionId = data.id;
            const collectionTarget = yield collection.findOneById(collectionId);
            collectionTarget.name = data.name;
            collectionTarget.description = data.description;
            collectionTarget.photoContents = data.photoContents;
            collectionTarget.tags = data.tags;
            collectionTarget.enabled = data.enabled;
            console.log(collectionTarget);
            try {
                yield connection.manager.persist(collectionTarget);
                console.log("collection updated");
                res.send(true);
            }
            catch (err) {
                if (err) {
                    res.send(false);
                }
            }
        }
    }));
    mount.post("/update/collection/dropbox-photo", (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (utils_1.isLoggedIn(req)) {
            const collection = connection.getRepository(collection_entity_1.Collection);
            const data = req.body;
            const collectionId = data.id;
            const collectionTarget = yield collection.findOneById(data.collectionId);
            let newContentItem = JSON.parse(data.newContent);
            newContentItem.ref = MD5.hex(newContentItem.ref);
            let oldPhotoContents = JSON.parse(collectionTarget.photoContents);
            collectionTarget.photoContents = JSON.stringify(oldPhotoContents.concat([newContentItem]));
            yield connection.manager.persist(collectionTarget)
                .then(() => {
                console.log("collection updated");
            })
                .catch((err) => {
                if (err) {
                    console.log(err);
                }
            });
            res.send(true);
        }
    }));
    mount.post("/save/dropbox-photo", (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (utils_1.isLoggedIn(req)) {
            const buf = new Buffer(req.body.imageData, 'base64');
            const name = req.body.filename;
            const ref = MD5.hex(name);
            const filename = path.join(saveFileDirDropbox, name);
            //prepare to save
            const photo = new photo_entity_1.Photo();
            photo.ref = MD5.hex(name);
            photo.url = "/uploads/dropbox/" + name;
            console.log(photo);
            yield connection.manager.persist(photo)
                .then(() => {
                console.log("saved photo");
            })
                .catch((err) => {
                if (err) {
                    console.log(err);
                }
            });
            const hasError = yield new Promise((resolve, reject) => {
                fs.writeFile(filename, buf, function (err) {
                    if (err) {
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                });
            });
            res.send(hasError);
        }
    }));
    mount.post("/delete/dropbox-photo", (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (utils_1.isLoggedIn(req)) {
            const filename = path.join(saveFileDirDropbox, req.body.filename);
            fs.stat(filename, function (err, stats) {
                if (err) {
                    res.send(false);
                }
                fs.unlink(filename, function (err) {
                    if (err) {
                        res.send(false);
                    }
                    console.log(filename, 'deleted successfully');
                });
            });
            res.send(true);
        }
    }));
    mount.post("/delete/collection", (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (utils_1.isLoggedIn(req)) {
            const id = req.body.id;
            const collectionRepo = connection.getRepository(collection_entity_1.Collection);
            const collection = yield collectionRepo.removeById(id).then(() => {
                res.send(true);
            });
        }
    }));
}
exports.postCollection = postCollection;
function postCollectionPhoto(mount, connection) {
    mount.post("/save/collection/photo", (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (utils_1.isLoggedIn(req)) {
            const collectionPhoto = req.files.file;
            const filename = path.resolve(__dirname, "../uploads", collectionPhoto.name);
            const url = "/uploads/" + collectionPhoto.name;
            //prepare to save
            const photo = new photo_entity_1.Photo();
            photo.ref = MD5.hex(collectionPhoto.name);
            photo.url = "/uploads/" + collectionPhoto.name;
            yield connection.manager.persist(photo)
                .then(() => {
                console.log("saved photo");
            })
                .catch((err) => {
                if (err) {
                    console.log(err);
                }
            });
            collectionPhoto.mv(filename, function (err) {
                if (err) {
                    console.log(err);
                }
                res.send(url);
            });
        }
    }));
}
exports.postCollectionPhoto = postCollectionPhoto;
