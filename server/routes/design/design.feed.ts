import {Design} from "../../entities/design.entity";

export async function designFeed(mount,connection){
    
    async function designFeedByParam(req,res){
        const collection = connection.getRepository(Design);

        let collectionJson;
        
        if( !("id" in req.params) || req.params.id === "" ||req.params.id === "all"){
            const collectionTarget = await collection.find();
            collectionJson = collectionTarget;
        }
        else{
            try{
                const collectionTarget = await collection.findOneById(req.params.id);
                collectionJson = collectionTarget;
            }
            catch(err){
                res.json({})
            }
        }

        res.json(collectionJson)
        //res.json()
    }

    mount.get("/feed/design/contents",designFeedByParam)
}