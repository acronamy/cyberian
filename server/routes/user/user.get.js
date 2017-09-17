"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const urls_config_1 = require("../../config/urls.config");
const main_injector_1 = require("./../main.injector");
const utils_1 = require("../../utils");
function userRoute(main, connection) {
    main.get(urls_config_1.urls.user.root, (req, res) => {
        let session = utils_1.isLoggedIn(req);
        const renderOptions = {
            template: null,
            session: req.cookies.session || false,
        };
        if (!session) {
            renderOptions.template = "login";
        }
        else {
            res.redirect("/editor/collections");
            return;
        }
        res.render("user", main_injector_1.injector.bind(Object.assign(res, main.get("siteMetadata"), renderOptions)));
    });
}
exports.userRoute = userRoute;
function userRegisterRoute(main, connection) {
    main.get(urls_config_1.urls.user.register, (req, res) => {
        const renderOptions = {
            template: "register"
        };
        res.render("user", main_injector_1.injector.bind(Object.assign(res, main.get("siteMetadata"), renderOptions)));
    });
}
exports.userRegisterRoute = userRegisterRoute;
