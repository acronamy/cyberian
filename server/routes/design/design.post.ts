import { Application, Request } from "express"
import { isLoggedIn } from "../../utils";
import {Connection} from "typeorm";
import { Design } from "../../entities/design.entity";

export function postDesignUpdate(mount:Application, connection:Connection) {

    mount.post("/design/update", async (req, res) => {
        if (isLoggedIn(req)) {
            
            const designRepository = connection.getRepository(Design);
            const design = await designRepository.findOneById(1);
            
            const name = req.body.name;
            const value = req.body.value;

            //map data to values
            //Color
            if(name === 'primary-color'){
                design.themePrimaryColor = value;
            }
            else if(name === 'theme-color'){
                design.themeGeneralColor = value;
            }
            else if(name === 'text-color'){
                design.themeTextColor = value;
            }
            //carousel
            else if(name === 'carousel-includes'){
                design.carouselIncludes = value||"";
            }
            else if(name === 'carousel-speed'){
                design.carouselSpeed = value;
            }
            else if(name === 'carousel-autoscroll'){
                console.log(design)
                let translateValue;
                if(value === "true"){
                    translateValue = true;
                }
                else{
                    translateValue = false;
                }
                console.log(typeof new Boolean(value))
                design.carouselAutoScroll = translateValue?1:0;
            }

            //photo gallery includes
            else if(name === 'photo-gallery-includes'){
                design.photoGaleryncludes = value||"";
            }
            

            try{
                await designRepository.save(design);
                res.send(true);
                console.log("Theme changes saved.")
                console.log(design)
            }
            catch(err){
                if(err){
                    res.send(false);
                }
            }

        }
    });

}