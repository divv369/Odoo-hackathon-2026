const Trip = require("../models/trip.js");
const Section = require("../models/section.js");

// POST /trips/:id/sections  — "Add another Section" button on Screen 5
module.exports.createSection = async (req, res) => {
    let trip = await Trip.findById(req.params.id);
    let newSection = new Section(req.body.section);
    newSection.tripId = trip._id;
    newSection.order = trip.sections.length;
    await newSection.save();

    trip.sections.push(newSection);
    await trip.save();

    req.flash("success", "Section added!");
    res.redirect(`/trips/${trip._id}/edit`);
};

module.exports.deleteSection = async (req, res) => {
    let { id, sectionId } = req.params;
    await Trip.findByIdAndUpdate(id, { $pull: { sections: sectionId } });
    await Section.findByIdAndDelete(sectionId);
    req.flash("success", "Section removed!");
    res.redirect(`/trips/${id}/edit`);
};

// POST /trips/:id/sections/:sectionId/activities — line items for Screen 9
// (name + expense + date -> "Physical Activity" / "Expense" columns)
module.exports.addActivity = async (req, res) => {
    let { id, sectionId } = req.params;
    let section = await Section.findById(sectionId);
    section.activities.push(req.body.activity);
    await section.save();
    req.flash("success", "Activity added to itinerary!");
    res.redirect(`/trips/${id}`);
};
