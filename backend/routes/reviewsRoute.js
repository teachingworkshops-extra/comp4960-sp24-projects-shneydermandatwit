import express from "express";
import { Review } from "../models/reviewModel.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { User } from "../models/userModel.js";


const reviewsRoute = express.Router();

reviewsRoute.post('/create', async (req, res) => {
    try {
        if (
            !req.body.title ||
            !req.body.description ||
            !req.body.building ||
            !req.body.floor ||
            !req.body.room
        ) {
            return res.status(400).send({
                message: "Send all required fields: displayName, email, password"
            });
        }

        // Verify JWT token from request headers
        const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the format: Bearer <token>
        const decodedToken = jwt.verify(token, JWT_SECRET);

        // Extract email and display name from decoded token
        const { email, displayName } = decodedToken;


        const newReview = {
            title: req.body.title,
            description: req.body.description,
            building: req.body.building,
            floor: req.body.floor,
            room: req.body.room,
            posterEmail: email,
            posterDisplayName: displayName
        }
        const review = await Review.create(newReview);

        return res.status(201).send(review);
    } catch (error) {
        console.log(error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ message: "Invalid token" });
        }
        res.status(500).send({ message: error.message });
    }
})

reviewsRoute.get('/', async (req, res) => {
    try {
        const building = req.query.building;
        const floor = req.query.floor;
        const room = req.query.room;


        if (!building && room || !building && floor || !floor && room) {
            return res.status(400).send({ message: "A room requires a floor to be present and a floor requires a building to be present." });
        }

        const query = {};

        if (building) {
            query.building = building;
            if (floor) {
                query.floor = floor;
                if (room) {
                    query.room = room;
                }
            }
        }


        const reviews = await Review.find(query);

        if (reviews.length === 0) {
            return res.status(404).send({ message: "No reviews found." });
        }

        return res.status(200).send(reviews);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
})

reviewsRoute.delete('/:id', async (req, res) => {//need to check if the review was created by the user deleting it
    try {

        // Verify JWT token from request headers
        const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the format: Bearer <token>
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { email, displayName,permission } = decodedToken;


        const reviewID = req.params.id;

        const review = await Review.findById(reviewID);
        console.log(permission);


        if (review.posterEmail != email && permission != 'admin') {
            return res.status(403).send({ message: "posterEmail does not match JWT email and user is not admin" });
        }


        const deletedReview = await Review.findByIdAndDelete(reviewID);

        if (!deletedReview) {
            return res.status(404).send({ message: "Review not found" })
        }

        return res.status(204).send({ message: "Succesfully deleted record" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
})

reviewsRoute.get('/rooms', async (req,res)=>{

    try{
        const building = req.query.building;
        const floor = req.query.floor;

        if(!building || !floor){
            return res.status(400).send({message: "Must provide building and floor."})
        }

        const query = {};
        query.building = building;
        query.floor = floor;

        const reviews = await Review.find(query);
    

        if(!reviews){
            res.status(404).send({message: "No reviews match this building and floor combination"})
        }

        const roomsSet  = new Set();

        for(let i  of reviews){
            roomsSet.add(i.room);
        }

        const roomsArray = Array.from(roomsSet);

        res.status(200).send(roomsArray);


    }catch(error){
        console.log(error);
        return res.status(500).send({ message: error });
    }


})


export default reviewsRoute;