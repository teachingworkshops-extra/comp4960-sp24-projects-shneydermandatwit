import express from "express";
import { Marker } from "../models/markerModel.js";

const markersRoute = express.Router();

markersRoute.get('/', async (req, res) => {
    try {
        const allMarkers = await Marker.find();

        res.status(200).json(allMarkers);
    } catch (error) {
        console.error("Error fetching markers:", error);
        res.status(500).json({ error: "Failed to fetch markers" });
    }
});

export default markersRoute;
