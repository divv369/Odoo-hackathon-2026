const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(upload.single("photo"), userController.signup);

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.login
    );

router.get("/logout", userController.logout);

module.exports = router;