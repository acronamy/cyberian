import * as cheerio from "cheerio";
import * as request from "request";

//Injectables
import { injectAt, production } from "./injectables/utils";
import { initTemplates, injectTemplate, pageClasses } from "./injectables/makeTemplate";
import { initLoggedIn, isLoggedIn} from "./injectables/sessions";
import commomHead from "./injectables/heads/common-head";
import editorHead from "./injectables/heads/editor-head";
import siteHead from "./injectables/heads/site-head";

//page components
import { createFolderTree } from "./injectables/page-collections/folder-tree";
import { dynamicStyleSheet } from "./injectables/page-front/dynamic-style";

export function injector(err, html) {
    const $ = cheerio.load(html);
    const injectUrl = injectAt.bind(this);
    const inTemplate = injectTemplate.bind(this)($);

    if (err) {
        this.render("error")
        return;
    }
    commomHead.bind(this)($);
    initTemplates.bind(this)($);
    pageClasses.bind(this)($);
    initLoggedIn.bind(this)($);
    

    //global behavior for urls
    injectUrl("", ()=>siteHead.bind(this)($));
    injectUrl( "/editor", ()=>editorHead.bind(this)($));


    //specific templates
    inTemplate("profile", ()=>{
        $("#user-hero").css({
            "background-image": `url(${this.cover})`
        })
    });
    
    
    inTemplate("collections", ()=>{
        createFolderTree.bind(this)($);
    });


    inTemplate("design", ()=>{
        $("#primary-color").val(this.design.themePrimaryColor);
        $("#theme-color").val(this.design.themeGeneralColor);
        $("#text-color").val(this.design.themeTextColor);


        //select 2 indirect populate WINDOW GLOBAL
        const CyberianPrepopulate = {
            "carousel-includes":this.design.carouselIncludes,
            "photo-gallery-includes":this.design.photoGaleryncludes
        }

        //carousel includes
        $("body").append("<script>window.CyberianPrepopulate = "+JSON.stringify(CyberianPrepopulate)+"</script>");
        
        $("[name='carousel-speed']").val(this.design.carouselSpeed);
        //carousel other
        if(this.design.carouselAutoScroll === 0){
            $("[name='carousel-autoscroll']").removeAttr("checked");    
        }
    })

    this.send($.html());

}