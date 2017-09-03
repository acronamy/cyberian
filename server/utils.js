"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsHash = require("jshashes");
const bcrypt = require("bcrypt");
const jdenticon = require("jdenticon");
const user_entity_1 = require("./entities/user.entity");
function isLoggedIn(req) {
    console.log(req.cookies);
    if (req.cookies && "session" in req.cookies) {
        return true;
    }
    else {
        return false;
    }
}
exports.isLoggedIn = isLoggedIn;
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        const userInstance = new user_entity_1.User();
        //for jdenticon
        const MD5 = new jsHash.MD5;
        const passwordHash = yield bcrypt.hash(user.password, saltRounds).then(hash => hash);
        userInstance.avatar = jdenticon.toSvg(MD5.hex(user.username), 200);
        userInstance.bio = user.bio;
        userInstance.email = user.email;
        userInstance.forHire = user.forHire;
        userInstance.first_name = user.first_name;
        userInstance.last_name = user.last_name;
        userInstance.username = user.username;
        userInstance.password = passwordHash;
        yield this.manager
            .persist(userInstance)
            .then(user => {
            console.log(user);
            console.log("User has been saved");
        })
            .catch(err => { if (err) {
            console.log(err);
        } });
    });
}
exports.createUser = createUser;
