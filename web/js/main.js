const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('click', (evt) => {
    alert("Lat, Lon : " + evt.latlng.lat + ", " + evt.latlng.lng)
});

map.on('locationfound', (evt) => {
    map.setView(ev.latlng, 13);
});
