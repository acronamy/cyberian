import { globalData } from "../page-front/global-data";
import { dynamicStyleSheet } from "../page-front/dynamic-style";


export default function siteHead($){
    $("head").append("<link rel='stylesheet' type='text/css' href='/styles/cyberian-front.css'/>")
    $("body").append("<script src='/scripts/cyberian-common.bundle.js'></script>")
    $("body").append("<script src='/scripts/cyberian-main.bundle.js'></script>")

    //Design was set in the design page then
    if(this.hasOwnProperty("design")){
        globalData.bind(this)($);
        dynamicStyleSheet.bind(this)($);
    }
}