const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateReview } = require("../middleware.js");
const communityController = require("../controllers/community.js");

router.get("/", wrapAsync(communityController.index));
router.post("/", isLoggedIn, validateReview, wrapAsync(communityController.createPost));

module.exports = router;
