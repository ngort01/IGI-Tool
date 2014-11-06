// Muenster coords
var lon = 7.6286;
var lat = 51.9629;

// map definition
var map = L.map('map', {
    zoomControl: false,
    center: [lat, lon],
    zoom: 14
})
// relative map height			
$("#map").height($(window).height()-210);
map.invalidateSize();

// gesture panel height
$("#gestures").height($(window).height()-210);

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



$(document).ready(function() {
	$("#nav").ferroMenu({
		position    : "center-bottom", // initial position of the menu in one of the 9 anchor points
		open	: 100
	});
	// slim scrollbar settings
	$('#gestures').slimScroll({
		height: "$(window).height()-250",
		color: '#f2f2f2',
		railVisible: true,
		railColor: 'white',
		railOpacity: 0.4
	});
});

