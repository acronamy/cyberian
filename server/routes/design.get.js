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
const main_injector_1 = require("./main.injector");
const design_entity_1 = require("../entities/design.entity");
function designGet(mount, connection) {
    mount.get("/design", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const designRepo = connection.getRepository(design_entity_1.Design);
            const design = yield designRepo.findOneById(1);
            const renderOptions = {
                template: "design",
                session: req.cookies.session || false,
                design: design
            };
            res.render("editor", {}, main_injector_1.injector.bind(Object.assign(res, mount.get("siteMetadata"), renderOptions)));
        });
    });
}
exports.designGet = designGet;
