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
const urls_config_1 = require("../../config/urls.config");
const utils_1 = require("../../utils");
const user_entity_1 = require("../../entities/user.entity");
const bcrypt = require("bcrypt");
function userRegisterPostRoute(main, connection) {
    main.post(urls_config_1.urls.user.POST_register, (req, res) => {
        const formData = req.body;
        const name = {
            first: formData.first_name,
            last: formData.last_name
        };
        const bio = formData.bio;
        const email = formData.email;
        const forHire = formData.for_hire;
        const username = formData.username;
        const password = formData.password;
        utils_1.createUser.bind(connection)({
            username: username,
            first_name: name.first,
            last_name: name.last,
            avatar: "",
            password: password,
            bio: bio,
            email: email,
            forHire: forHire
        })
            .catch(function (err) {
            console.log(err);
        });
        res.redirect("/user");
    });
}
exports.userRegisterPostRoute = userRegisterPostRoute;
function userLoginPostRoute(main, connection) {
    main.post(urls_config_1.urls.user.login, (req, res) => __awaiter(this, void 0, void 0, function* () {
        //fake login always passes for the moment
        const usernameInput = req.body.username.toLowerCase();
        const passwordInput = req.body.password;
        console.log("login attempt", "\nUsername", usernameInput, "\nPassword", passwordInput);
        const userInstance = yield connection
            .getRepository(user_entity_1.User)
            .findOne({ username: usernameInput });
        //1 find user or fail
        //2 if user check password or message user WRONG PASSWORD.
        //Note it would be easy to warn if username (specific) is wrong but for security reasons we wont.
        if (userInstance) {
            //check for password
            const passwordCheck = yield bcrypt.compare(passwordInput, userInstance.password);
            if (passwordCheck) {
                //password correct
                //1 day 8.64e+7
                res.cookie("session", {
                    loggedIn: new Date()
                }, { maxAge: 8.64e+7, httpOnly: true });
                res.send(userInstance);
            }
            else {
                //password wrong
                res.send(false);
            }
        }
        else {
            //no such user!
            console.log("no such user");
            res.send(false);
        }
    }));
}
exports.userLoginPostRoute = userLoginPostRoute;
function userLogoutPostRoute(main, connection) {
    main.post(urls_config_1.urls.user.logout, function (req, res) {
        res.clearCookie("session");
        res.send("");
    });
}
exports.userLogoutPostRoute = userLogoutPostRoute;
function userCheckPostRoute(main, connection) {
    /**
     * Check if user exists
    */
    main.post(urls_config_1.urls.user.POST_exists, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username.toLowerCase();
        const userInstance = yield connection
            .getRepository(user_entity_1.User)
            .findOne({ username: username });
        if (userInstance) {
            res.send(userInstance);
        }
        else {
            res.send(false);
        }
    }));
}
exports.userCheckPostRoute = userCheckPostRoute;
