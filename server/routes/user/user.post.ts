import { urls } from "../../config/urls.config";
import { createUser } from "../../utils"
import { User } from "../../entities/user.entity";
import * as bcrypt from "bcrypt";

export function userRegisterPostRoute(main, connection) {
    main.post(urls.user.POST_register, (req, res) => {
        const formData = req.body;

        const name = {
            first: formData.first_name,
            last: formData.last_name
        }
        const bio = formData.bio;
        const email = formData.email;
        const forHire = formData.for_hire;
        const username = formData.username;
        const password = formData.password;

        createUser.bind(connection)({
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
                console.log(err)
            })

        res.redirect("/user");
    })
}

export function userLoginPostRoute(main, connection) {
    main.post(urls.user.login, async (req, res) => {

        //fake login always passes for the moment
        const usernameInput = req.body.username.toLowerCase();
        const passwordInput = req.body.password;

        console.log("login attempt", "\nUsername", usernameInput, "\nPassword", passwordInput)


        const userInstance = await connection
            .getRepository(User)
            .findOne({ username: usernameInput })

        //1 find user or fail
        //2 if user check password or message user WRONG PASSWORD.
        //Note it would be easy to warn if username (specific) is wrong but for security reasons we wont.
        if (userInstance) {
            //check for password
            const passwordCheck = await bcrypt.compare(passwordInput, userInstance.password);
            if (passwordCheck) {
                //password correct
                //1 day 8.64e+7
                res.cookie("session", {
                    loggedIn: new Date()
                }, { maxAge: 8.64e+7, httpOnly: true })
                res.send(userInstance);
            }
            else {
                //password wrong
                res.send(false);
            }
        }
        else {
            //no such user!
            console.log("no such user")
            res.send(false)
        }
    })
}

export function userLogoutPostRoute(main, connection) {
    main.post(urls.user.logout, function (req, res) {
        res.clearCookie("session");
        res.send("")
    })
}

export function userCheckPostRoute(main, connection){
    /**
     * Check if user exists
    */
    main.post(urls.user.POST_exists ,async (req,res)=>{
        const username = req.body.username.toLowerCase();
        const userInstance = await connection
            .getRepository(User)
            .findOne({username:username})

        if(userInstance){
            res.send(userInstance);
        }
        else{
            res.send(false)
        }
    })
}




