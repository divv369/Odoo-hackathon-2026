const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    name: { type: String, required: true },
    expense: { type: Number, default: 0 },
    date: Date, // used to group activities into "Day 1 / Day 2..." on Screen 9
});

const sectionSchema = new Schema({
    tripId: {
        type: Schema.Types.ObjectId,
        ref: "Trip",
    },
    title: {
        type: String,
        required: true, // e.g. "Section 1", "Flight to Tokyo", "Hotel Stay"
    },
    type: {
        type: String,
        enum: ["travel", "stay", "activity", "other"],
        default: "other",
    },
    startDate: Date,
    endDate: Date,
    budget: {
        type: Number,
        default: 0,
    },
    order: {
        type: Number,
        default: 0,
    },
    activities: [activitySchema],
});

// helper: total spend for this section = section budget baseline + sum of activity expenses
sectionSchema.methods.totalExpense = function () {
    return this.activities.reduce((sum, a) => sum + (a.expense || 0), 0);
};

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
