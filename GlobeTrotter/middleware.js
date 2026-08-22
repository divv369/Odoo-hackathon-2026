const Trip = require("./models/trip.js");
const Section = require("./models/section.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const { tripSchema, sectionSchema, activitySchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let trip = await Trip.findById(id);
    if (!trip.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this trip!");
        return res.redirect(`/trips/${id}`);
    }
    next();
};

// section routes are nested as /trips/:id/sections/:sectionId
// so we check ownership via the parent trip's :id param
module.exports.isTripOwnerForSection = async (req, res, next) => {
    let { id } = req.params; // trip id
    let trip = await Trip.findById(id);
    if (!trip) {
        req.flash("error", "Trip not found!");
        return res.redirect("/trips");
    }
    if (!trip.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this trip!");
        return res.redirect(`/trips/${id}`);
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
        req.flash("error", "Admin access only!");
        return res.redirect("/trips");
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect("/community");
    }
    next();
};

module.exports.validateTrip = (req, res, next) => {
    let { error } = tripSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateSection = (req, res, next) => {
    let { error } = sectionSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateActivity = (req, res, next) => {
    let { error } = activitySchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
