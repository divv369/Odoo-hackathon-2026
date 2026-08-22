// Sample trips to seed the DB so the demo isn't empty.
// NOTE: `owner` must be set to a real User _id after you've registered
// at least one account — see init/index.js for how this is wired up.
const sampleTrips = [
    {
        title: "Japan Adventure",
        description: "Cherry blossoms, temples, and ramen.",
        image: {
            filename: "tripimage",
            url: "https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=800&q=60",
        },
        place: "Tokyo",
        country: "Japan",
        startDate: new Date("2026-09-16"),
        endDate: new Date("2026-09-23"),
    },
    {
        title: "Paris Trip",
        description: "Croissants, the Louvre, and the Eiffel Tower.",
        image: {
            filename: "tripimage",
            url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=60",
        },
        place: "Paris",
        country: "France",
        startDate: new Date("2026-08-15"),
        endDate: new Date("2026-08-22"),
    },
    {
        title: "NYC Getaway",
        description: "Broadway, Central Park, and pizza.",
        image: {
            filename: "tripimage",
            url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=60",
        },
        place: "New York City",
        country: "USA",
        startDate: new Date("2026-10-14"),
        endDate: new Date("2026-10-16"),
    },
];

module.exports = { data: sampleTrips };
