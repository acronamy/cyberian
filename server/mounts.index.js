"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
/**
 * The main express application
*/
const main = express();
exports.main = main;
/**
 * The editor mount which bootstraps the main application
*/
const editor = express();
exports.editor = editor;
