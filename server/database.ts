import {createConnection, ConnectionOptions} from "typeorm";
import {User} from "./entities/user.entity";

const options:ConnectionOptions = {
    type:"sqlite",
    database:"./index.db",
    autoSchemaSync:true,
    entities:[
        User
    ]
}

const database = createConnection(options)

export {database};