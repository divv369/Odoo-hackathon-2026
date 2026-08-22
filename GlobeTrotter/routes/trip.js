const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateTrip } = require("../middleware.js");
const tripController = require("../controllers/trips.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Screen 3 — landing / all trips
router.route("/")
    .get(wrapAsync(tripController.index))
    .post(
        isLoggedIn,
        upload.single("trip[image]"),
        validateTrip,
        wrapAsync(tripController.createTrip)
    );

router.get("/search", wrapAsync(tripController.searchTrips));

// Screen 6 — logged-in user's own trips, grouped Ongoing/Upcoming/Completed
router.get("/mine", isLoggedIn, wrapAsync(tripController.myTrips));

// Screen 4 — Create a new Trip
router.get("/new", isLoggedIn, tripController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(tripController.showTrip)) // Screens 5 & 9
    .put(
        isLoggedIn,
        isOwner,
        upload.single("trip[image]"),
        validateTrip,
        wrapAsync(tripController.updateTrip)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(tripController.destroyTrip));

// Screen 5 — Build Itinerary (edit form shows sections + "Add another Section")
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(tripController.renderEditForm));

module.exports = router;
