import * as cheerio from "cheerio";

const webpackGlobal = require("../../webpack.config");
//DI
const webpackOutputDir = webpackGlobal.output.path;
const webpackOutputFilename = webpackGlobal.output.filename;
const webpackOutputUrl = "/bundle";


export function injector(err, html){
  
    const $ = cheerio.load(html);
    //head
    $("head").append('<script src="http://localhost:35729/livereload.js"></script>')
    $("head").append(`<title>${this.name} | ${this.req.url.replace("/","")}</title>`)
    $("head").append( `<script src="${webpackOutputUrl}/${webpackOutputFilename}"></script>`);
    
    if(this.template){
        console.log(this.template)
        const templateParent = $("#"+this.template).parent()
        templateParent.append($("#"+this.template).html())
    }

    if(this.template==="profile"){
        $("#user-hero").css({
            "background-image":`url(${this.cover})`
        })
    }

    if(this.template==="photos"||this.template==="collections"){
        const dummy = [1,2,3,4,5,6,7,8,9,10]

        dummy.forEach(function(){
            $(".gridstack").append("<div class='card'></div>")
        })
    }

    if(this.session){
        $("body").addClass("logged-in");
        $("body").prepend(`<div id="page-top"></div>`);
    }

    if(err){
        this.render("error")
    }
    else{
        this.send($.html())
    }
}