mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: trip.geometry.coordinates,
    zoom: 9,
});

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(trip.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h4>${trip.title}</h4><p>Trip destination</p>`
        )
    )
    .addTo(map);