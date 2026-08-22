const Review = require("../models/review.js");

// Screen 10 — Community tab: every review/experience across every trip,
// newest first. Same Review model StayFinder already had, just not
// scoped to a single trip anymore.
module.exports.index = async (req, res) => {
    const posts = await Review.find({})
        .populate("author")
        .populate("tripId")
        .sort({ createdAt: -1 });
    res.render("community/index.ejs", { posts });
};

// A general community post not tied to any specific trip (tripId left null)
module.exports.createPost = async (req, res) => {
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    req.flash("success", "Shared with the community!");
    res.redirect("/community");
};
