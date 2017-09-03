import {injector} from "../main.injector";
import { Design } from "../../entities/design.entity";

export function designGet(mount, connection){
    mount.get("/design",async function(req,res){

        const designRepo = connection.getRepository(Design);
        const design = await designRepo.findOneById(1);

        const renderOptions = {
            template:"design",
            session:req.cookies.session||false,
            design:design
        }
        
        res.render("editor",{},injector.bind( Object.assign(
            res, 
            mount.get("siteMetadata"), 
            renderOptions
        )));
    })
}