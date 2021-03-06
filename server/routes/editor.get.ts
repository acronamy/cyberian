import { Application, Request } from "express"
import { isLoggedIn } from "../utils"
import * as path from "path";
import {Connection} from "typeorm";
import { injector } from "./main.injector";
import { Collection } from "../entities/collection.entity";
import { Photo } from "../entities/photo.entity";
const Dropbox = require("dropbox");
const dbx = new Dropbox({ accessToken: '9x3oXu1QUfAAAAAAAAAQhpuxPKAV8iQfdN3ZljlNfCaf9WCY2TBxWly8WymlraLV' });

export function collectionsRoute(mount:Application, connection:Connection){
    
    //login status
    mount.use("*",(req,res,next)=>{
        if(!isLoggedIn(req)){
            res.redirect("/user")
        }
        else{
            next();
        }
    });


    

    mount.get("/collections", async (req, res)=>{
        
        const connectionsRepo = connection.getRepository(Collection)
        const photoRepo = connection.getRepository(Photo)
        const collections = await connectionsRepo.find()


        for(let collection of collections){


            let photos = JSON.parse(collection.photoContents);


            for(let photo of photos){
                let loadedPhoto = await photoRepo.findOne({ref:photo.ref})
                photo.orientation = loadedPhoto.orientation;
                photo.url = loadedPhoto.url;
            }

            collection.photoContents = photos;
        }


        async function loadDropboxFolder(path){
            const  dbxPathContent = await dbx.filesListFolder({path: path})
            const folders = dbxPathContent.entries.filter(folder=>folder[".tag"]==="folder");
            return folders;
        }
        
        
        const renderOptions = {
            template:"collections",
            session:req.cookies.session||false,
            collections:collections,
            dropbox:{
                folders:await loadDropboxFolder("/website")
            }
        }

        res.render("editor", {}, injector.bind( Object.assign(
            res, 
            mount.get("siteMetadata"), 
            renderOptions
        )));
        
    })
}