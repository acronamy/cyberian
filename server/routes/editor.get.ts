import { Application, Request } from "express"
import { isLoggedIn } from "../utils"
import * as path from "path";
import {Connection} from "typeorm";
import { injector } from "./main.injector";

export function photosRoute(mount:Application, connection:Connection){
    mount.get("/editor/photos", (req, res)=>{
        const renderOptions = {
            template:"photos",
            session:req.cookies.session||false,
        }

        res.render("editor", {}, injector.bind( Object.assign(
            res, 
            mount.get("siteMetadata"), 
            renderOptions
        )));

    })
}


export function collectionsRoute(mount:Application, connection:Connection){
    mount.get("/editor/collections", (req, res)=>{
        const renderOptions = {
            template:"collections",
            session:req.cookies.session||false,
        }

        res.render("editor", {}, injector.bind( Object.assign(
            res, 
            mount.get("siteMetadata"), 
            renderOptions
        )));

    })
}