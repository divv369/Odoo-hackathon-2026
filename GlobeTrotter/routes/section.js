const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {
    isLoggedIn,
    isTripOwnerForSection,
    validateSection,
    validateActivity,
} = require("../middleware.js");
const sectionController = require("../controllers/sections.js");

// /trips/:id/sections
router.post(
    "/",
    isLoggedIn,
    isTripOwnerForSection,
    validateSection,
    wrapAsync(sectionController.createSection)
);

router.delete(
    "/:sectionId",
    isLoggedIn,
    isTripOwnerForSection,
    wrapAsync(sectionController.deleteSection)
);

// /trips/:id/sections/:sectionId/activities
router.post(
    "/:sectionId/activities",
    isLoggedIn,
    isTripOwnerForSection,
    validateActivity,
    wrapAsync(sectionController.addActivity)
);

module.exports = router;
