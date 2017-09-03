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
const utils_1 = require("../../utils");
const design_entity_1 = require("../../entities/design.entity");
function postDesignUpdate(mount, connection) {
    mount.post("/design/update", (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (utils_1.isLoggedIn(req)) {
            const designRepository = connection.getRepository(design_entity_1.Design);
            const design = yield designRepository.findOneById(1);
            const name = req.body.name;
            const value = req.body.value;
            //map data to values
            //Color
            if (name === 'primary-color') {
                design.themePrimaryColor = value;
            }
            else if (name === 'theme-color') {
                design.themeGeneralColor = value;
            }
            else if (name === 'text-color') {
                design.themeTextColor = value;
            }
            else if (name === 'carousel-includes') {
                design.carouselIncludes = value || "";
            }
            else if (name === 'carousel-speed') {
                design.carouselSpeed = value;
            }
            else if (name === 'carousel-autoscroll') {
                console.log(design);
                let translateValue;
                if (value === "true") {
                    translateValue = true;
                }
                else {
                    translateValue = false;
                }
                console.log(typeof new Boolean(value));
                design.carouselAutoScroll = translateValue ? 1 : 0;
            }
            else if (name === 'photo-gallery-includes') {
                design.photoGaleryncludes = value || "";
            }
            try {
                yield designRepository.save(design);
                res.send(true);
                console.log("Theme changes saved.");
                console.log(design);
            }
            catch (err) {
                if (err) {
                    res.send(false);
                }
            }
        }
    }));
}
exports.postDesignUpdate = postDesignUpdate;
