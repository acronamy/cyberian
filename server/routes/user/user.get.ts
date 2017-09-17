import { urls } from "../../config/urls.config";
import { injector } from "./../main.injector";
import { isLoggedIn } from "../../utils"

export function userRoute(main, connection){
    main.get( urls.user.root , (req, res)=>{
        
        let session = isLoggedIn(req);

        const renderOptions = {
            template:null,
            session:req.cookies.session||false,
        }
        if(!session){
            renderOptions.template = "login"
        }
        else{
            res.redirect("/editor/collections")
            return;
        }

        res.render("user", injector.bind(Object.assign(
            res, 
            main.get("siteMetadata"),
            renderOptions
        )))
    })
}

export function userRegisterRoute(main, connection){
    main.get( urls.user.register , (req, res)=>{
        const renderOptions = {
            template:"register"
        }

        res.render("user", injector.bind(Object.assign(
            res,
            main.get("siteMetadata"), 
            renderOptions
        )))
    })
}