export function initTemplates($){
    if(this.hasOwnProperty("template") && typeof this.template === "string"){
        const templateParent = $("#" + this.template).parent();
        templateParent.append( $("#" + this.template).html() );
    }
}

export function pageClasses($){
    if(this.hasOwnProperty("template") && typeof this.template === "string"){
       $("body").addClass(`page-${this.template}`).addClass("page")
    }
}

export function injectTemplate(){
    return (function(id:string,cb:Function){
        if (this.template === id) {
            console.log("RAN")
            cb();
        }
    })
    .bind(this);
}