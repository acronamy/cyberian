export function isLoggedIn(){
    if(this.hasOwnProperty("session") && this.session){
        return true;
    }
    return false;
}

export function initLoggedIn($){
    if(isLoggedIn.bind(this)()){
        $("body").addClass("logged-in");
        $("body").prepend(`<div id="page-top"></div>`);
    }
    else{
        $("body").addClass("not-logged-in");
    }
}
