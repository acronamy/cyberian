import * as path from "path";
import {createConnection, ConnectionOptions} from "typeorm";
import {User} from "./entities/user.entity";
import {Site} from "./entities/site.entity"
import {Collection} from "./entities/collection.entity";
import {Photo} from "./entities/photo.entity";
import { Design } from "./entities/design.entity";

const options:ConnectionOptions = {
    type:"mysql",
    driver:{
        type:"mysql",
        host: "localhost",
        port: 3306,
        username:"root",
        password:"moocow000",
        database:"cyberian",
    },
    autoSchemaSync:true,
    entities:[
        User,
        Site,
        Collection,
        Photo,
        Design
    ]
}

const database = createConnection(options)

export {database};