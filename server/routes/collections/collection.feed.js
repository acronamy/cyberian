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
const collection_entity_1 = require("../../entities/collection.entity");
function collectionFeed(mount, connection) {
    return __awaiter(this, void 0, void 0, function* () {
        function collectionFeedByParam(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const collection = connection.getRepository(collection_entity_1.Collection);
                let collectionJson;
                if (!("id" in req.params) || req.params.id === "" || req.params.id === "all") {
                    const collectionTarget = yield collection.find();
                    collectionJson = collectionTarget;
                }
                else {
                    try {
                        const collectionTarget = yield collection.findOneById(req.params.id);
                        collectionJson = collectionTarget;
                    }
                    catch (err) {
                        res.json({});
                    }
                }
                res.json(collectionJson);
                //res.json()
            });
        }
        function collectionContentsFeedByParam(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const collection = connection.getRepository(collection_entity_1.Collection);
                let collectionJson;
                if (!("id" in req.params) || req.params.id === "" || req.params.id === "all") {
                    const collectionTarget = yield collection.find();
                    collectionJson = collectionTarget.map(collection => {
                        return {
                            content: JSON.parse(collection.photoContents)
                        };
                    });
                }
                else {
                    try {
                        const collectionTarget = yield collection.findOneById(req.params.id);
                        collectionJson = JSON.parse(collectionTarget.photoContents);
                    }
                    catch (err) {
                        res.json({});
                    }
                }
                res.json(collectionJson);
            });
        }
        mount.get("/feed/collection/:id/contents", collectionContentsFeedByParam);
        mount.get("/feed/collection/contents", collectionContentsFeedByParam);
        mount.get("/feed/collection/:id", collectionFeedByParam);
        mount.get("/feed/collection", collectionFeedByParam);
    });
}
exports.collectionFeed = collectionFeed;
