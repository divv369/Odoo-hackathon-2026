if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const initData = require("./data.js");
const Trip = require("../models/trip.js");

const dbUrl = process.env.ATLASDB_URL;

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

// IMPORTANT: register at least one user first (via the app's /signup page),
// then paste that user's _id below so seeded trips have a valid owner.
const PLACEHOLDER_OWNER_ID = "6a859a9d716583bf88c7617f";

const initDB = async () => {
    await Trip.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: PLACEHOLDER_OWNER_ID }));
    await Trip.insertMany(initData.data);
    console.log("data was initialized");
    mongoose.connection.close();
};

initDB();
