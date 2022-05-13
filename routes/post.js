import routes from "express";
import verify from "./tokenVerify.js";
import User from "../model/User.js";
import Post from "../model/Post.js";

const postRoutes = routes.Router();

//create a new post
postRoutes.post("/", verify, async (req, res)=>{

    const newPost= new Post(req.body);
    console.dir(req.body);
    try{
    const savedPost = await newPost.save();

    res.status(200).send(savedPost);
    }catch(err){

        res.status(500).send(err);
    }
})

//get all user's posts by username
postRoutes.get("/profile/:username", verify, async (req, res)=>{

    try{
        const user= await User.find({username: req.params.username});
        
        const posts= await Post.find({userId: user[0]._id});

        
        res.status(200).send({user, posts});

    }catch(err){
        res.status(500).send(err);
    }



});

//get all posts that belong to a users timeline
postRoutes.get("/:id", verify, async (req, res)=>{
    console.log(req.params.id);
    try{
        const user= await User.findOne({_id:req.params.id});
        console.log(user);
        const userPosts= await Post.find({userId: user._id});
        

        const friendPosts = await Promise.all(

            user.following.map((friendId)=>{
                return Post.find({userId: friendId});
            })
            

        );
            res.status(200).send(userPosts.concat(...friendPosts));
    }catch(err){
        res.status(500).send(err);
    }

});

postRoutes.get("/data/all", async (req, res) =>{

    try{
        
        const allPosts = await Post.find();
        res.status(200).send(allPosts);

    }catch(err){
        res.status(500).send(err);
    }
});

//add a like/unlike
postRoutes.put("/like/:postId", verify, async (req, res)=>{

    try{
        const post= await Post.findById(req.params.postId);
       
console.log("like test: "+req.user._id);
        if(!post.likes.includes(req.user._id)){
            
            await post.updateOne({
                $push: {likes: req.user._id}
            })
            res.status(200).send({like: true});
        }else{
            
            await post.updateOne({
                $pull: {likes: req.user._id}
            })
            res.status(200).send({like: false});
        }
        
        

    }catch(err){
        res.status(500).send(err);
    }

});

//add comment
postRoutes.put("/comment/:postId", async (req, res) =>{

    try{

    const post = await Post.findById(req.params.postId);

    if(post){
        
     await post.updateOne({
         $push :{comments: req.body}
     });
     res.status(200).send({commit:true});
    }

    
    }catch(err){
        res.status(500).send(err);
    }


});


export default postRoutes;