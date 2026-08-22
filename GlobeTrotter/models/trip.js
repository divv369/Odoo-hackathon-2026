const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Section = require("./section.js");

const tripSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "tripimage",
        },
        url: {
            type: String,
            default:
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        },
    },
    place: String,       // was "location" in StayFinder
    country: String,
    startDate: Date,
    endDate: Date,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    sections: [
        {
            type: Schema.Types.ObjectId,
            ref: "Section",
        },
    ],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
        },
    },
});

// virtual: is this trip Ongoing / Upcoming / Completed (Screens 3 & 6)
tripSchema.methods.getStatus = function () {
    const now = new Date();
    if (this.endDate && now > this.endDate) return "completed";
    if (this.startDate && now < this.startDate) return "upcoming";
    return "ongoing";
};

tripSchema.post("findOneAndDelete", async (trip) => {
    if (trip) {
        await Section.deleteMany({ _id: { $in: trip.sections } });
    }
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
