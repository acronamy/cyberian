"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isLoggedIn() {
    if (this.hasOwnProperty("session") && this.session) {
        return true;
    }
    return false;
}
exports.isLoggedIn = isLoggedIn;
function initLoggedIn($) {
    if (isLoggedIn.bind(this)()) {
        $("body").addClass("logged-in");
        $("body").prepend(`<div id="page-top"></div>`);
    }
    else {
        $("body").addClass("not-logged-in");
    }
}
exports.initLoggedIn = initLoggedIn;
