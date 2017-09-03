"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function editorHead($) {
    $("body").addClass("page-editor").addClass("editor");
    $("body").append("<script src='/scripts/cyberian-common.bundle.js'></script>");
    $("body").append("<script src='/scripts/cyberian-main.bundle.js'></script>");
    if (utils_1.production) {
        $("head").append("<link rel='stylesheet' type='text/css' href='/styles/cyberian-admin.css'/>");
    }
    else {
        $("body").append("<script src='/scripts/cyberian-admin.bundle.js'></script>");
    }
}
exports.default = editorHead;
