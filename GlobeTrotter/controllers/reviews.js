const Trip = require("../models/trip.js");
const Review = require("../models/review.js");

// Reviews attached to a specific trip (e.g. "leave feedback on this trip")
module.exports.createReview = async (req, res) => {
    let trip = await Trip.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    newReview.tripId = trip._id;

    await newReview.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/trips/${trip._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/trips/${id}`);
};