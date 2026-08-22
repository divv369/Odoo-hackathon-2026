const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        // Screen 2 (Registration): First/Last Name, Email, Phone, City,
        // Country, Additional Info, Photo — username/password handled by
        // passport-local-mongoose below.
        let {
            username,
            email,
            password,
            firstName,
            lastName,
            phone,
            city,
            country,
            additionalInfo,
        } = req.body;

        const newUser = new User({
            email,
            username,
            firstName,
            lastName,
            phone,
            city,
            country,
            additionalInfo,
        });

        if (req.file) {
            newUser.photo = { url: req.file.path, filename: req.file.filename };
        }

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to GlobeTrotter!");
            res.redirect("/trips");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to stayfinder!");
    let redirectUrl = res.locals.redirectUrl || "/trips";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "you are logged out!");
        res.redirect("/trips");
    });
};