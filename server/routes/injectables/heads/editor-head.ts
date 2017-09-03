import { production } from "../utils";

export default function editorHead($){
    $("body").addClass("page-editor").addClass("editor");
    $("body").append("<script src='/scripts/cyberian-common.bundle.js'></script>");
    $("body").append("<script src='/scripts/cyberian-main.bundle.js'></script>");
    if(production){
        $("head").append("<link rel='stylesheet' type='text/css' href='/styles/cyberian-admin.css'/>")
    }
    else{
        $("body").append("<script src='/scripts/cyberian-admin.bundle.js'></script>");
    }
}