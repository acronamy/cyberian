"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function initTemplates($) {
    if (this.hasOwnProperty("template") && typeof this.template === "string") {
        const templateParent = $("#" + this.template).parent();
        templateParent.append($("#" + this.template).html());
    }
}
exports.initTemplates = initTemplates;
function pageClasses($) {
    if (this.hasOwnProperty("template") && typeof this.template === "string") {
        $("body").addClass(`page-${this.template}`).addClass("page");
    }
}
exports.pageClasses = pageClasses;
function injectTemplate() {
    return (function (id, cb) {
        if (this.template === id) {
            console.log("RAN");
            cb();
        }
    })
        .bind(this);
}
exports.injectTemplate = injectTemplate;
