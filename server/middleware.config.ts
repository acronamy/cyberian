import * as express from "express";
import { editor, main} from "./mounts.index";
import { urls } from "./urls.config";
import * as path from "path";

// Middleware
import * as fileUpload from "express-fileupload";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as hbs from 'express-hbs';

// Data
const webpackGlobal = require("../webpack.config");


// Common middleware
main.use( urls.editor, editor );
main.use(bodyParser.urlencoded({ extended: false }))
main.use(fileUpload());
main.use(cookieParser())

// Static
const webpackOutputDir = webpackGlobal.output.path;
const webpackOutputFilename = webpackGlobal.output.filename;
const webpackOutputUrl = "/bundle";
main.use(webpackOutputUrl, express.static( webpackOutputDir ))
main.use( urls.media , express.static( path.join(__dirname, "public", "media") ));
main.use( urls.uploads , express.static( path.join(__dirname, "uploads") ));

//Static => Styles
main.use(urls.styles, express.static( path.join(__dirname, "public", "styles") ))
editor.use(urls.styles, express.static( path.join(__dirname, "public", "styles") ))

//Static => Scripts
main.use(urls.scripts, express.static( path.join(__dirname, "public", "scripts") ))
editor.use(urls.scripts, express.static( path.join(__dirname, "public", "scripts") ))

// Templating
main.engine('hbs', hbs.express4());
main.set('view engine', 'hbs');
main.set('views', path.join(__dirname, '/templates'));
editor.set('views', path.join(__dirname, '/templates'))