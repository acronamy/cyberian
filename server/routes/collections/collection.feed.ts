import {Collection} from "../../entities/collection.entity";

export async function collectionFeed(mount,connection){
    
    async function collectionFeedByParam(req,res){
        const collection = connection.getRepository(Collection);

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

    async function collectionContentsFeedByParam(req,res){
        const collection = connection.getRepository(Collection);

        let collectionJson;
        
        if( !("id" in req.params) || req.params.id === "" ||req.params.id === "all"){
            const collectionTarget = await collection.find();

            collectionJson = collectionTarget.map(collection=>{
                return {
                    content:JSON.parse(collection.photoContents)
                }
            });
        }
        else{
            try{
                const collectionTarget = await collection.findOneById(req.params.id);
                collectionJson = JSON.parse(collectionTarget.photoContents);
            }
            catch(err){
                res.json({})
            }
        }

        res.json(collectionJson);
    }

    mount.get("/feed/collection/:id/contents",collectionContentsFeedByParam)
    mount.get("/feed/collection/contents",collectionContentsFeedByParam)
    mount.get("/feed/collection/:id",collectionFeedByParam)
    mount.get("/feed/collection",collectionFeedByParam)
}