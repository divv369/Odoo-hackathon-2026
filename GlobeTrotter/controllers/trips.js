const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

// Mapbox is optional — an invalid/missing token would otherwise crash the
// whole app at boot (the SDK validates the token synchronously on import).
let geocodingClient = null;
try {
    if (mapToken) {
        geocodingClient = mbxGeocoding({ accessToken: mapToken });
    }
} catch (e) {
    console.log("Mapbox token invalid or missing — place geocoding disabled.");
}

const Trip = require("../models/trip.js");
const Section = require("../models/section.js");

// Screen 3 (Landing) — top regions/previous trips can slice this same query
module.exports.index = async (req, res) => {
    const allTrips = await Trip.find({ owner: req.user ? req.user._id : null });
    res.render("trips/index.ejs", { allTrips });
};

// Screen 6 — Trip Listing grouped into Ongoing / Upcoming / Completed
module.exports.myTrips = async (req, res) => {
    const trips = await Trip.find({ owner: req.user._id });
    const grouped = { ongoing: [], upcoming: [], completed: [] };
    trips.forEach((t) => grouped[t.getStatus()].push(t));
    res.render("trips/mytrips.ejs", { grouped });
};

module.exports.renderNewForm = (req, res) => {
    res.render("trips/new.ejs");
};

// Screen 5 (Build Itinerary) + Screen 9 (Itinerary View with Budget)
module.exports.showTrip = async (req, res) => {
    let { id } = req.params;
    const trip = await Trip.findById(id)
        .populate({ path: "sections" })
        .populate("owner");

    if (!trip) {
        req.flash("error", "Trip you requested does not exist!");
        return res.redirect("/trips");
    }

    // flatten all activities across sections, group by day number relative to trip.startDate
    // this powers the "Day 1 / Day 2..." view on Screen 9
    let dayGroups = {};
    let totalBudget = 0;
    trip.sections.forEach((section) => {
        totalBudget += section.budget || 0;
        section.activities.forEach((activity) => {
            totalBudget += activity.expense || 0;
            let dayNum = 1;
            if (trip.startDate && activity.date) {
                const diffMs = new Date(activity.date) - new Date(trip.startDate);
                dayNum = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
            }
            if (!dayGroups[dayNum]) dayGroups[dayNum] = [];
            dayGroups[dayNum].push(activity);
        });
    });

    res.render("trips/show.ejs", { trip, dayGroups, totalBudget });
};

module.exports.createTrip = async (req, res) => {
    let response = { body: { features: [] } };
    if (geocodingClient) {
        try {
            response = await geocodingClient
                .forwardGeocode({ query: req.body.trip.place, limit: 1 })
                .send();
        } catch (e) {
            response = { body: { features: [] } };
        }
    }

    const newTrip = new Trip(req.body.trip);
    newTrip.owner = req.user._id;

    if (req.file) {
        newTrip.image = { url: req.file.path, filename: req.file.filename };
    }

    if (response.body.features.length) {
        newTrip.geometry = response.body.features[0].geometry;
    }

    await newTrip.save();
    req.flash("success", "New Trip created! Now build your itinerary.");
    res.redirect(`/trips/${newTrip._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const trip = await Trip.findById(id).populate("sections");
    res.render("trips/edit.ejs", { trip });
};

module.exports.updateTrip = async (req, res) => {
    let { id } = req.params;
    let trip = await Trip.findByIdAndUpdate(id, { ...req.body.trip });

    if (req.file) {
        trip.image = { url: req.file.path, filename: req.file.filename };
        await trip.save();
    }

    req.flash("success", "Trip Updated!");
    res.redirect(`/trips/${id}`);
};

module.exports.destroyTrip = async (req, res) => {
    let { id } = req.params;
    await Trip.findByIdAndDelete(id);
    req.flash("success", "Trip Deleted!");
    res.redirect("/trips");
};

// Screen 8 — Activity/City Search Page (search across trips by place/country/title)
module.exports.searchTrips = async (req, res) => {
    let { search } = req.query;
    if (!search) return res.redirect("/trips");

    const allTrips = await Trip.find({
        $or: [
            { title: { $regex: search, $options: "i" } },
            { place: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } },
        ],
    });

    if (allTrips.length === 0) {
        req.flash("error", "No trips found for your search!");
        return res.redirect("/trips");
    }
    res.render("trips/index.ejs", { allTrips });
};
