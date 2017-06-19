import {Request} from "express";

function isLoggedIn(req:Request){
    if(req.cookies && "session" in req.cookies){
        return true;
    }
    else{
        return false;
    }
}


export {isLoggedIn};