import { Application, Request } from "express"
import { isLoggedIn } from "../utils"
import * as path from "path";
import * as fs from "fs";
import {Connection} from "typeorm";
import {Collection} from "../entities/collection.entity";
import {Photo} from "../entities/photo.entity";
import * as jsHash from "jshashes";
const MD5 = new jsHash.MD5;

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