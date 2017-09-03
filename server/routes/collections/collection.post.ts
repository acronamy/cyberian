import { Application, Request } from "express"
import { isLoggedIn } from "../../utils"
import * as path from "path";
import * as fs from "fs";
import {Connection} from "typeorm";
import {Collection} from "../../entities/collection.entity";
import {Photo} from "../../entities/photo.entity";
import * as jsHash from "jshashes";
const MD5 = new jsHash.MD5;

const saveFileDirDropbox = path.resolve(__dirname, "../uploads","dropbox");

interface RequestWithFiles extends Request {
    files: any;
}

export function postCollection(mount:Application, connection:Connection) {

    mount.post("/save/collection", async (req: RequestWithFiles, res) => {
        if (isLoggedIn(req)) {

            const collection = new Collection();

            const data = req.body;

            collection.description = data.description;
            collection.enabled = data.enabled;
            collection.name = data.name;
            collection.photoContents = data.photoContents;
            collection.tags = data.tags;
            await connection.manager.persist(collection)
                .then(()=>{
                    console.log("collection saved")
                })
                .catch((err)=>{
                    if(err){
                        console.log(err);
                    }
                })
            res.send(true)
        }
    });

    mount.post("/update/collection", async (req, res) => {
        if (isLoggedIn(req)) {

            const collection = connection.getRepository(Collection);
            const data = req.body;
            const collectionId = data.id;
            const collectionTarget = await collection.findOneById(collectionId);

            collectionTarget.name = data.name;
            collectionTarget.description = data.description;
            collectionTarget.photoContents = data.photoContents;
            collectionTarget.tags = data.tags;
            collectionTarget.enabled = data.enabled;

            console.log(collectionTarget)

            try{
                await connection.manager.persist(collectionTarget)
                console.log("collection updated")
                res.send(true)
            }
            catch(err){
                if(err){
                    res.send(false)
                }
            }
        }
    });

    mount.post("/update/collection/dropbox-photo", async (req: RequestWithFiles, res) => {
        if (isLoggedIn(req)) {

            const collection = connection.getRepository(Collection);
            const data = req.body;
            const collectionId = data.id;
            const collectionTarget = await collection.findOneById(data.collectionId);

            let newContentItem = JSON.parse(data.newContent);
            newContentItem.ref = MD5.hex(newContentItem.ref);
            let oldPhotoContents = JSON.parse(collectionTarget.photoContents);

            collectionTarget.photoContents = JSON.stringify(oldPhotoContents.concat([newContentItem]));


            await connection.manager.persist(collectionTarget)
                .then(()=>{
                    console.log("collection updated")
                })
                .catch((err)=>{
                    if(err){
                        console.log(err);
                    }
                })
            res.send(true)
        }
    });

    mount.post("/save/dropbox-photo", async (req: RequestWithFiles, res) => {
        if (isLoggedIn(req)) {
            const buf = new Buffer(req.body.imageData, 'base64');
            const name = req.body.filename;
            const ref = MD5.hex(name);
            const filename = path.join(saveFileDirDropbox,name);

            //prepare to save
            const photo = new Photo()
            photo.ref = MD5.hex(name);
            photo.url = "/uploads/dropbox/"+name;


            console.log(photo);

            await connection.manager.persist(photo)
                .then(()=>{
                    console.log("saved photo")
                })
                .catch((err)=>{
                    if(err){
                        console.log(err);
                    }
                })

            const hasError = await new Promise((resolve,reject)=>{
                fs.writeFile(filename, buf, function(err) {
                    if(err){
                        resolve(false);
                    }
                    else{
                        resolve(true);
                    }
                });
            })
            res.send(hasError)

        }
    });

    mount.post("/delete/dropbox-photo", async (req: RequestWithFiles, res) => {
        if (isLoggedIn(req)) {
            
            const filename = path.join(saveFileDirDropbox,req.body.filename);
            fs.stat(filename, function (err, stats) {

                if (err) {
                    res.send(false);
                }

                fs.unlink(filename,function(err){
                        if(err){
                            res.send(false);
                        }
                        console.log(filename,'deleted successfully');
                });  
            });
            res.send(true);
        }
    });

    mount.post("/delete/collection", async (req: RequestWithFiles, res) => {
        if (isLoggedIn(req)) {
            const id = req.body.id;
            const collectionRepo = connection.getRepository(Collection);
            const collection = await collectionRepo.removeById(id).then(()=>{
                res.send(true)
            })
        }
    });

}

export function postCollectionPhoto(mount:Application, connection:Connection) {

    mount.post("/save/collection/photo", async (req: RequestWithFiles, res) => {
        if (isLoggedIn(req)) {
            const collectionPhoto = req.files.file;
            const filename = path.resolve(__dirname, "../uploads", collectionPhoto.name);
            const url = "/uploads/"+collectionPhoto.name
            
            //prepare to save
            const photo = new Photo()
            photo.ref = MD5.hex(collectionPhoto.name);
            photo.url = "/uploads/"+collectionPhoto.name;
            
            await connection.manager.persist(photo)
                .then(()=>{
                    console.log("saved photo")
                })
                .catch((err)=>{
                    if(err){
                        console.log(err);
                    }
                })

            collectionPhoto.mv(filename, function (err) {
                if (err) {
                    console.log(err)
                }
                res.send(url);
            });

        }
    });

}