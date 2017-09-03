"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = require("yargs");
function injectAt(url, callback) {
    if (this.req.baseUrl === url) {
        callback(this);
    }
}
exports.injectAt = injectAt;
exports.production = !(yargs_1.argv.develop);
