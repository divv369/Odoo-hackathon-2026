const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose =
  require("passport-local-mongoose").default ||
  require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    firstName: String,
    lastName: String,
    phone: String,
    city: String,
    country: String,
    additionalInfo: String,
    photo: {
        filename: { type: String, default: "userphoto" },
        url: {
            type: String,
            default:
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60",
        },
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

// passport-local-mongoose adds + manages: username, password (hashed), salt
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
