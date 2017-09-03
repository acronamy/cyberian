"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const site_entity_1 = require("./entities/site.entity");
const collection_entity_1 = require("./entities/collection.entity");
const photo_entity_1 = require("./entities/photo.entity");
const design_entity_1 = require("./entities/design.entity");
const options = {
    type: "mysql",
    driver: {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "moocow000",
        database: "cyberian",
    },
    autoSchemaSync: true,
    entities: [
        user_entity_1.User,
        site_entity_1.Site,
        collection_entity_1.Collection,
        photo_entity_1.Photo,
        design_entity_1.Design
    ]
};
const database = typeorm_1.createConnection(options);
exports.database = database;
