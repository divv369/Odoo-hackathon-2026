const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const adminController = require("../controllers/admin.js");

router.get("/", isLoggedIn, isAdmin, wrapAsync(adminController.dashboard));
router.get("/users", isLoggedIn, isAdmin, wrapAsync(adminController.manageUsers));
router.delete("/users/:id", isLoggedIn, isAdmin, wrapAsync(adminController.deleteUser));

module.exports = router;
