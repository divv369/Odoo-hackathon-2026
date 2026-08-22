const Trip = require("../models/trip.js");
const Section = require("../models/section.js");
const User = require("../models/user.js");

// Screen 12 — Admin Panel. Treat as a stretch goal; this gives you the
// three aggregation queries the wireframe describes, ready to render.
module.exports.dashboard = async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalTrips = await Trip.countDocuments();

    // Popular cities: group trips by place, count, sort desc
    const popularCities = await Trip.aggregate([
        { $group: { _id: "$place", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ]);

    // Popular activities: unwind embedded activities across all sections, group by name
    const popularActivities = await Section.aggregate([
        { $unwind: "$activities" },
        { $group: { _id: "$activities.name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ]);

    res.render("admin/dashboard.ejs", {
        totalUsers,
        totalTrips,
        popularCities,
        popularActivities,
    });
};

module.exports.manageUsers = async (req, res) => {
    const users = await User.find({});
    res.render("admin/users.ejs", { users });
};

module.exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash("success", "User removed.");
    res.redirect("/admin/users");
};
