"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const urls_config_1 = require("../../config/urls.config");
const main_injector_1 = require("./../main.injector");
function userRoute(main, connection) {
    main.get(urls_config_1.urls.user.root, (req, res) => {
        const isLoggedIn = "session" in req.cookies;
        const renderOptions = {
            template: isLoggedIn ? "profile" : "login",
            session: req.cookies.session || false,
        };
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
