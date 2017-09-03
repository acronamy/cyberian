import { injector } from "../main.injector";
import { Design } from "../../entities/design.entity";

export function frontRoute(main, connection){
    main.get('/', async (req, res)=>{

        const designRepo = connection.getRepository(Design);
        const design = await designRepo.findOneById(1);

        console.log(design)

        const renderOptions = {
            session:req.cookies.session||false,
            design:design
        }

        res.render("index", injector.bind( Object.assign(
            res, 
            main.get("siteMetadata"), 
            renderOptions,
        )));
    })
}