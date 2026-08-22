const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema= new Schema({
    comment: String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
     author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // NEW: optional link to the trip this review/experience is about.
    // Nullable so a general community post doesn't require a trip.
    tripId: {
        type: Schema.Types.ObjectId,
        ref: "Trip",
    },

});

module.exports = mongoose.model("Review",reviewSchema);