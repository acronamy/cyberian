import * as firstRun from "first-run";
import {Site} from "./entities/site.entity";
import { Design } from "./entities/design.entity";

export async function installSite(connection, main, editor){
    if(firstRun()){

        const siteSettings = new Site();
        const design = new Design();

        siteSettings.name = "David Gould Photography";
        siteSettings.email = "hello@aconamy.com";
        siteSettings.cover = "/media/default-cover.jpg";

        const siteRepo = connection.getRepository(Site)
        const designRepo = connection.getRepository(Design);
        await siteRepo.persist(siteSettings);
        await designRepo.persist({});




        main.set("siteMetadata", {
            name:siteSettings.name,
            email:siteSettings.email,
            cover:siteSettings.cover
        });

    }
    else{
        console.log("Installed: true")

        const siteSettings = await connection.getRepository(Site).findOne({id:1})
        const renderMetadata = {
            name:siteSettings.name,
            email:siteSettings.email,
            cover:siteSettings.cover
        }
        main.set("siteMetadata",renderMetadata);
        
    }

    //Testing always clears
    //firstRun.clear();
}