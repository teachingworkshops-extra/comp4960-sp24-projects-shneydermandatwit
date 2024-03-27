import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        building: {
            type: String,
            required: true
        },
        floor: {
            type: String,
            required: true
        },
        room: {
            type: String,
            required: true
        },
        posterEmail: {
            type: String,
            required: true
        },
        posterDisplayName: {
            type: String,
            required: true
        },
       
    },
    {
        timestamps: true
    }
)

export const Review = mongoose.model('reviews', reviewSchema);