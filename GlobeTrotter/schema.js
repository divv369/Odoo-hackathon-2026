const Joi = require("joi");

module.exports.tripSchema = Joi.object({
    trip: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow("", null),
        place: Joi.string().required(),
        country: Joi.string().allow("", null),
        image: Joi.string().allow("", null),
        startDate: Joi.date().required(),
        endDate: Joi.date().required().min(Joi.ref("startDate")),
    }).required(),
});

module.exports.sectionSchema = Joi.object({
    section: Joi.object({
        title: Joi.string().required(),
        type: Joi.string().valid("travel", "stay", "activity", "other").required(),
        startDate: Joi.date().allow(null, ""),
        endDate: Joi.date().allow(null, ""),
        budget: Joi.number().min(0).required(),
    }).required(),
});

module.exports.activitySchema = Joi.object({
    activity: Joi.object({
        name: Joi.string().required(),
        expense: Joi.number().min(0).required(),
        date: Joi.date().allow(null, ""),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
        tripId: Joi.string().allow("", null),
    }).required(),
});
