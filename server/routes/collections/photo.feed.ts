import {Photo} from "../../entities/photo.entity";

export async function photoFeed(mount, connection){
    
    async function photoFeedByParam(req,res){
        
        const photo = connection.getRepository(Photo);

        let photoJson;
        if(!("ref" in req.params) || req.params.ref === "all"){
            
            const photoTarget = await photo.find();
            photoJson = photoTarget;
        }
        else{
            const photoTarget = await photo.findOne( {ref:req.params.ref} );
            photoJson = photoTarget;
        }

        res.json(photoJson)
    }

    mount.get("/feed/photo",photoFeedByParam);
    mount.get("/feed/photo/:ref",photoFeedByParam);
}