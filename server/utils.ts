import * as jsHash from "jshashes";
import * as bcrypt from "bcrypt";
import * as jdenticon from "jdenticon";

import {Request} from "express";
import { User } from "./entities/user.entity";

function isLoggedIn(req:Request){
    console.log(req.cookies)
    if(req.cookies && "session" in req.cookies){
        return true;
    }
    else{
        return false;
    }
}

async function createUser(user:User){
    const saltRounds = 10;
    const userInstance = new User();
    //for jdenticon
    const MD5 = new jsHash.MD5;
    
    const passwordHash = await bcrypt.hash(user.password, saltRounds).then(hash=>hash);
    
    userInstance.avatar = jdenticon.toSvg(MD5.hex(user.username), 200);
    userInstance.bio = user.bio;
    userInstance.email = user.email;
    userInstance.forHire = user.forHire;
    userInstance.first_name = user.first_name;
    userInstance.last_name = user.last_name;
    userInstance.username = user.username;
    userInstance.password = passwordHash;

    await this.manager
        .persist(userInstance)
        .then(user => {
            console.log(user)
            console.log("User has been saved");
        })
        .catch(err=>{if(err){console.log(err)}});
}


export {isLoggedIn, createUser};