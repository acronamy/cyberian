import * as path from "path";
import {createConnection, ConnectionOptions} from "typeorm";
import {User} from "./entities/user.entity";

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
        User
    ]
}

const database = createConnection(options)

export {database};