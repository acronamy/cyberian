import * as express from "express";
import { editor, main} from "../mounts.index";
import { urls } from "./urls.config";
import * as path from "path";
import { argv } from "yargs";

// Middleware
import * as fileUpload from "express-fileupload";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as hbs from 'express-hbs';

// Data
const webpackGlobal = require("../../webpack.config.js")(argv);

export function configure(main, editor){

    // Common middleware

    const fileUploadSettings = {
        limits: { fileSize: 50 * 1024 * 1024 },
    }

    const bodyParserSettings = {
        extended: true,
        limit: '50mb',
        parameterLimit:5000000
    }
    
    main.use( urls.editor, editor );
    main.use(bodyParser.raw(bodyParserSettings));
    main.use(bodyParser.json(bodyParserSettings));
    main.use(bodyParser.urlencoded(bodyParserSettings))
    main.use( fileUpload( fileUploadSettings ) );
    main.use(cookieParser())

    editor.use(bodyParser.raw(bodyParserSettings));
    editor.use(bodyParser.json(bodyParserSettings));
    editor.use(bodyParser.urlencoded(bodyParserSettings))

    editor.use(fileUpload( fileUploadSettings ));
    editor.use(cookieParser());

    const serverRoot = path.resolve(__dirname,"../")

    // Static
    const webpackOutputDir = webpackGlobal.output.path;
    const webpackOutputFilename = webpackGlobal.output.filename;
    const webpackOutputUrl = "/bundle";
    main.use(webpackOutputUrl, express.static( webpackOutputDir ))
    main.use( urls.media , express.static( path.join( serverRoot, "public", "media") ));
    main.use( urls.uploads , express.static( path.join( serverRoot, "uploads") ));

    //Static => Styles
    main.use(urls.styles, express.static( path.join( serverRoot, "public", "styles") ))
    editor.use(urls.styles, express.static( path.join( serverRoot, "public", "styles") ))

    //Static => Scripts
    main.use(urls.scripts, express.static( path.join( serverRoot, "public", "scripts") ))
    editor.use(urls.scripts, express.static( path.join( serverRoot, "public", "scripts") ))

    // Templating
    main.engine('hbs', hbs.express4());
    main.set('view engine', 'hbs');
    main.set('views', path.join( serverRoot, '/templates'));
    editor.set('views', path.join( serverRoot, '/templates'))
}
