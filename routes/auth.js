import routes from "express";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  {registerValidation, loginValidation} from "../validation.js";

//Input validation

import Joi from "@hapi/joi";

const authRoutes = routes.Router();



authRoutes.post("/register", async (req, res) => {
    //validate user input b4 saving

    const {error}= registerValidation(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    //ensure user is not already in the database
    const emailExist= await User.findOne({email: req.body.email});

    if(emailExist) return res.status(400).send("Email already registered");

    const salt = await bcrypt.genSalt(10);

    const hashedPass= await bcrypt.hash(req.body.password, salt);

    //create a new user
    const user = new User({
        fullName: req.body.fullName,
        username: req.body.username,
        email: req.body.email,
        password: hashedPass,
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});



authRoutes.post("/login", async (req, res) => {


    //validate user input
    const {error}= loginValidation(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    //check if user is registered
    const user= await User.findOne({email: req.body.email});
    

    if(!user) return res.status(400).send("Email or password is incorrect");

    const password= user.password;

    //verify password
   const passValid = await bcrypt.compare(req.body.password,password)

   if(!passValid) return res.status(400).send("Email or password is incorrect");

   //provide jwt

   const token = jwt.sign({_id: user._id},process.env.JWT_TOKEN,{
       expiresIn:100000
   });

   res.header("authtoken", token).send(token);
});

export default authRoutes;