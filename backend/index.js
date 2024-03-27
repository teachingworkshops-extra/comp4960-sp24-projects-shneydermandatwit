import  express  from "express";
import { PORT, MONGO_URL } from "./config.js";
import mongoose from "mongoose";
//import { User } from "./models/userModel.js";
import cors from "cors";
import usersRoute from "./routes/usersRoute.js";
import reviewsRoute from "./routes/reviewsRoute.js"
import markersRoute from "./routes/markersRoute.js";



const app = express();

app.use(express.json());
app.use(cors());
app.use('/user', usersRoute);
app.use('/review', reviewsRoute);
app.use('/marker', markersRoute);




app.get('/', (req,res)=>{
    console.log("User oppened the site");
    return res.status(234).send("IT WORKS");
})



mongoose
    .connect(MONGO_URL)
    .then(()=>{
        console.log("App connected to MongoDB")

        app.listen(PORT, ()=>{
            console.log(`App is listening on port ${PORT}`)
        })
        
    })
    .catch((error)=>{
        console.log(error);
    })