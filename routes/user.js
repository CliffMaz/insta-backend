import routes from "express";
import verify from "./tokenVerify.js";
import User from "../model/User.js";

const userRoutes = routes.Router();


//get a user by id

userRoutes.get("/users", async (req, res)=>{

    try{

        const users = await User.find();

        res.status(200).send(users);
    }catch(err){
        res.status(404).send(err);
    }
});

userRoutes.get("/user/:userId",verify, async (req,res) =>{

    try{

        const user = await User.findById(req.params.userId);
        
        res.status(200).send(user);

    }catch(err){
        res.status(404).send(err);
    }
});

//follow a user

userRoutes.put("/follow",verify, async (req, res)=>{

    try{
        const loggedInUser = await User.findById(req.body.loggedInUser);
        const follow = await User.findById(req.body.follow);

        if(!loggedInUser.following.includes(req.body.follow) && !follow.followers.includes(req.body.loggedInUser)){
            await loggedInUser.updateOne(
                { $push: {following: req.body.follow}})

            await follow.updateOne(
                {
                    $push: {followers: req.body.loggedInUser}
                }
            )
                
            res.status(200).send({followed:true, unfollowed:false});
        }else{
                await loggedInUser.updateOne(
                    { $pull: {following: req.body.follow}})
    
                await follow.updateOne(
                    {
                        $pull: {followers: req.body.loggedInUser}
                    }
                    )
                    res.status(200).send({followed:false, unfollowed:true});
            }

    }catch(err){
        res.status(404).send({followed: false, unfollowed:false});
    }
});


//get a user by username

userRoutes.get("/user",verify, async (req,res) =>{

    try{

        const user = await User.findOne({username: req.body});
        res.status(200).send(user);

    }catch(err){
        res.status(404).send(err);
    }
});

//get a user by email

userRoutes.get("/email/:email", verify, async (req,res) =>{
    
    try{
        
        const user = await User.findOne({email:req.params.email});
        res.status(200).send(user);

    }catch(err){
        res.status(404).send(err);
    }
});

export default userRoutes;