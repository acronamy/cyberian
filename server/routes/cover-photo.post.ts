import { Application, Request } from "express"
import { isLoggedIn } from "../utils"
import * as path from "path";
import * as fs from "fs";
import {Connection} from "typeorm";
import {Site} from "../entities/site.entity";

interface RequestWithFiles extends Request {
    files: any;
}

export function postCoverPhoto(mount:Application, connection:Connection) {

    mount.post("/upload/cover-photo", (req: RequestWithFiles, res) => {
        if (isLoggedIn(req)) {
            const coverPhoto = req.files.file;
            const filename = path.resolve(__dirname, "../uploads", coverPhoto.name);

            coverPhoto.mv(filename, function (err) {
                if (err) {
                    console.log(err)
                }
                res.send("/uploads/"+coverPhoto.name);
            });

        }
    });

}