import { urls } from "../../config/urls.config";
import { injector } from "./../main.injector";

export function userRoute(main, connection){
    main.get( urls.user.root , (req, res)=>{
        
        const isLoggedIn = "session" in req.cookies;
        const renderOptions = {
            template:isLoggedIn?"profile":"login",
            session:req.cookies.session||false,
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