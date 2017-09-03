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
const photo_entity_1 = require("../../entities/photo.entity");
function photoFeed(mount, connection) {
    return __awaiter(this, void 0, void 0, function* () {
        function photoFeedByParam(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const photo = connection.getRepository(photo_entity_1.Photo);
                let photoJson;
                if (!("ref" in req.params) || req.params.ref === "all") {
                    const photoTarget = yield photo.find();
                    photoJson = photoTarget;
                }
                else {
                    const photoTarget = yield photo.findOne({ ref: req.params.ref });
                    photoJson = photoTarget;
                }
                res.json(photoJson);
            });
        }
        mount.get("/feed/photo", photoFeedByParam);
        mount.get("/feed/photo/:ref", photoFeedByParam);
    });
}
exports.photoFeed = photoFeed;
