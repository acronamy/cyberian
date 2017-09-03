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
const design_entity_1 = require("../../entities/design.entity");
function designFeed(mount, connection) {
    return __awaiter(this, void 0, void 0, function* () {
        function designFeedByParam(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const collection = connection.getRepository(design_entity_1.Design);
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
        mount.get("/feed/design/contents", designFeedByParam);
    });
}
exports.designFeed = designFeed;
