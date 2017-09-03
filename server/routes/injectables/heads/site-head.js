"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_data_1 = require("../page-front/global-data");
const dynamic_style_1 = require("../page-front/dynamic-style");
function siteHead($) {
    $("head").append("<link rel='stylesheet' type='text/css' href='/styles/cyberian-front.css'/>");
    $("body").append("<script src='/scripts/cyberian-common.bundle.js'></script>");
    $("body").append("<script src='/scripts/cyberian-main.bundle.js'></script>");
    //Design was set in the design page then
    if (this.hasOwnProperty("design")) {
        global_data_1.globalData.bind(this)($);
        dynamic_style_1.dynamicStyleSheet.bind(this)($);
    }
}
exports.default = siteHead;
