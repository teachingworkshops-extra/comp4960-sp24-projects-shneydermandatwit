import mongoose from "mongoose";

const markerSchema = mongoose.Schema(
    {
        building: {
            type: String,
            required: true
        },
        lon: {
            type: Number,
            required: true
        },
        lat: {
            type: Number,
            required: true
        }
       
    }
)

export const Marker = mongoose.model('markers', markerSchema);