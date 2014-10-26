var lon = 7.6286;
var lat = 51.9629;

// map definition
var map = L.map('map', {
    zoomControl: false,
    center: [lat, lon],
    zoom: 14
})

// OSM layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// Leaflet.Geosearch: Search Bar (Provider: OpenStreetMap)
new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.OpenStreetMap(),
    showMarker: false
}).addTo(map);

// add zoom functionality
map.addControl(L.control.zoom());