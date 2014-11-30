(function() {
    Map.prototype.map = null;

    function Map(id) {
        var self = this;
        // Muenster coords
        var lon = 7.6286;
        var lat = 51.9629;

        // map definition
        self.map = L.map("map", {
                zoomControl: true,
                center: [lat, lon],
                zoom: 14
            })
			
		// relative map height			
		$("#map").height($(window).height() - 160);
		self.map.invalidateSize();

        // OSM layer
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(self.map);


        // Leaflet.Geosearch: Search Bar (Provider: OpenStreetMap)
        new L.Control.GeoSearch({
            provider: new L.GeoSearch.Provider.OpenStreetMap(),
            showMarker: false
        }).addTo(self.map);

    }

    window.Map = Map;

}(window));



var m = null;
var paused = false;
/**
Init
**/
function init() {
    m = new Map("map");
	// gesture panel height
	getPois(m.map);
    var lc = new LeapController(m.map);
    lc.init();
}

/**
Load elements on document ready
**/
$(document).ready(function() {
    $("#nav").ferroMenu({
        position: "center-bottom", // initial position of the menu in one of the 9 anchor points
        open: 100
    });
	
	$(document).on("menuopened",function(){
        paused = true; // pause map interactions when the menu is opened
    });
	
	$(document).on("menuclosed",function(){
        paused = false; // start map interactions when the menu is closed
		$(menuItems[curMenuItem]).css({"opacity": "1", "box-shadow":"none"});
    });
	
    // slim scrollbar settings
    $('#gestures').slimScroll({
        height: "$(window).height()-250",
        color: '#f2f2f2',
        railVisible: false,
        railColor: 'white',
        railOpacity: 0.4
    });
	
	$("#gestures").height($(window).height() - 160); //gesture panel height
	
    init();
});