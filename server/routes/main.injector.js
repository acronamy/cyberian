"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
//Injectables
const utils_1 = require("./injectables/utils");
const makeTemplate_1 = require("./injectables/makeTemplate");
const sessions_1 = require("./injectables/sessions");
const common_head_1 = require("./injectables/heads/common-head");
const editor_head_1 = require("./injectables/heads/editor-head");
const site_head_1 = require("./injectables/heads/site-head");
//page components
const folder_tree_1 = require("./injectables/page-collections/folder-tree");
function injector(err, html) {
    const $ = cheerio.load(html);
    const injectUrl = utils_1.injectAt.bind(this);
    const inTemplate = makeTemplate_1.injectTemplate.bind(this)($);
    if (err) {
        this.render("error");
        return;
    }
    common_head_1.default.bind(this)($);
    makeTemplate_1.initTemplates.bind(this)($);
    makeTemplate_1.pageClasses.bind(this)($);
    sessions_1.initLoggedIn.bind(this)($);
    //global behavior for urls
    injectUrl("", () => site_head_1.default.bind(this)($));
    injectUrl("/editor", () => editor_head_1.default.bind(this)($));
    //specific templates
    inTemplate("profile", () => {
        $("#user-hero").css({
            "background-image": `url(${this.cover})`
        });
    });
    inTemplate("collections", () => {
        folder_tree_1.createFolderTree.bind(this)($);
    });
    inTemplate("design", () => {
        $("#primary-color").val(this.design.themePrimaryColor);
        $("#theme-color").val(this.design.themeGeneralColor);
        $("#text-color").val(this.design.themeTextColor);
        //select 2 indirect populate WINDOW GLOBAL
        const CyberianPrepopulate = {
            "carousel-includes": this.design.carouselIncludes,
            "photo-gallery-includes": this.design.photoGaleryncludes
        };
        //carousel includes
        $("body").append("<script>window.CyberianPrepopulate = " + JSON.stringify(CyberianPrepopulate) + "</script>");
        $("[name='carousel-speed']").val(this.design.carouselSpeed);
        //carousel other
        if (this.design.carouselAutoScroll === 0) {
            $("[name='carousel-autoscroll']").removeAttr("checked");
        }
    });
    this.send($.html());
}
exports.injector = injector;
