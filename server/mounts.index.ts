import * as express from "express";

/**
 * The main express application
*/
const main = express();
/**
 * The editor mount which bootstraps the main application
*/
const editor = express();

export {
    main, 
    editor
}