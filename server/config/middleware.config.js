"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const urls_config_1 = require("./urls.config");
const path = require("path");
const yargs_1 = require("yargs");
// Middleware
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const hbs = require("express-hbs");
// Data
const webpackGlobal = require("../../webpack.config.js")(yargs_1.argv);
function configure(main, editor) {
    // Common middleware
    const fileUploadSettings = {
        limits: { fileSize: 50 * 1024 * 1024 },
    };
    const bodyParserSettings = {
        extended: true,
        limit: '50mb',
        parameterLimit: 5000000
    };
    main.use(urls_config_1.urls.editor, editor);
    main.use(bodyParser.raw(bodyParserSettings));
    main.use(bodyParser.json(bodyParserSettings));
    main.use(bodyParser.urlencoded(bodyParserSettings));
    main.use(fileUpload(fileUploadSettings));
    main.use(cookieParser());
    editor.use(bodyParser.raw(bodyParserSettings));
    editor.use(bodyParser.json(bodyParserSettings));
    editor.use(bodyParser.urlencoded(bodyParserSettings));
    editor.use(fileUpload(fileUploadSettings));
    editor.use(cookieParser());
    const serverRoot = path.resolve(__dirname, "../");
    // Static
    const webpackOutputDir = webpackGlobal.output.path;
    const webpackOutputFilename = webpackGlobal.output.filename;
    const webpackOutputUrl = "/bundle";
    main.use(webpackOutputUrl, express.static(webpackOutputDir));
    main.use(urls_config_1.urls.media, express.static(path.join(serverRoot, "public", "media")));
    main.use(urls_config_1.urls.uploads, express.static(path.join(serverRoot, "uploads")));
    //Static => Styles
    main.use(urls_config_1.urls.styles, express.static(path.join(serverRoot, "public", "styles")));
    editor.use(urls_config_1.urls.styles, express.static(path.join(serverRoot, "public", "styles")));
    //Static => Scripts
    main.use(urls_config_1.urls.scripts, express.static(path.join(serverRoot, "public", "scripts")));
    editor.use(urls_config_1.urls.scripts, express.static(path.join(serverRoot, "public", "scripts")));
    // Templating
    main.engine('hbs', hbs.express4());
    main.set('view engine', 'hbs');
    main.set('views', path.join(serverRoot, '/templates'));
    editor.set('views', path.join(serverRoot, '/templates'));
}
exports.configure = configure;
