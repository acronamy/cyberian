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
const firstRun = require("first-run");
const site_entity_1 = require("./entities/site.entity");
const design_entity_1 = require("./entities/design.entity");
function installSite(connection, main, editor) {
    return __awaiter(this, void 0, void 0, function* () {
        if (firstRun()) {
            const siteSettings = new site_entity_1.Site();
            const design = new design_entity_1.Design();
            siteSettings.name = "David Gould Photography";
            siteSettings.email = "hello@aconamy.com";
            siteSettings.cover = "/media/default-cover.jpg";
            const siteRepo = connection.getRepository(site_entity_1.Site);
            const designRepo = connection.getRepository(design_entity_1.Design);
            yield siteRepo.persist(siteSettings);
            yield designRepo.persist({});
            main.set("siteMetadata", {
                name: siteSettings.name,
                email: siteSettings.email,
                cover: siteSettings.cover
            });
        }
        else {
            console.log("Installed: true");
            const siteSettings = yield connection.getRepository(site_entity_1.Site).findOne({ id: 1 });
            const renderMetadata = {
                name: siteSettings.name,
                email: siteSettings.email,
                cover: siteSettings.cover
            };
            main.set("siteMetadata", renderMetadata);
        }
        //Testing always clears
        //firstRun.clear();
    });
}
exports.installSite = installSite;
