import express from "express";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const usersRoute = express.Router();

usersRoute.post('/register', async (req, res)=>{
    try{
        if(
            !req.body.displayName ||
            !req.body.email ||
            !req.body.password
        ){
            return res.status(400).send({
                message: "Send all required fields: displayName, email, password"
            });
        }

        const existingUser = await User.findOne({ email: req.body.email });

        // If the email already exists, return a 409 Conflict response
        if (existingUser) {
            return res.status(409).send({
                message: "Email already in use. Please choose a different email."
            });
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = {
            displayName: req.body.displayName,
            email: req.body.email,
            password: hashedPassword
        }
        const user = await User.create(newUser);

        return res.status(201).send(user);
    } catch (error){
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
})

usersRoute.post('/login', async (req, res)=>{
    try{
        if(
            !req.body.email ||
            !req.body.password
        ){
            res.status(400).send({
                message: "Must provide both username and password"
            })
        }

        const user = await User.findOne({ email: req.body.email});

        if (!user){
            return res.status(404).send({message:"User not found"})
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if(!passwordMatch){
            return res.status(401).send({ message: "Invalid password"});
        }

        const token = jwt.sign({email: user.email, displayName:user.displayName, permission:user.permission}, JWT_SECRET);

        res.cookie('jwt', token, { httpOnly: true });


        return res.status(200).json({user, token});
    }catch(error){
        console.log(error.message);
        res.status(500).send({
            message: error.message
        });
    }
})
export default usersRoute;

