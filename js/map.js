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
        $("#map").height($(window).height() - 140);
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
var storyline = L.polyline([], {
    color: "red",
    opacity: 0.7
}); //connects story elements

/**
Init
**/
function init() {
    m = new Map("map");
    // gesture panel height
    getPois(m.map);
    storyline.addTo(m.map);
    var lc = new LeapController(m.map);
    lc.init();
}

/**
Load elements on document ready
**/
$(document).ready(function() {
    $("#nav").ferroMenu({
        position: "center-bottom", // initial position of the menu in one of the 9 anchor points
        open: 100,
        drag: false
    });

    $(document).on("menuopened", function() {
        paused = true; // pause map interactions when the menu is opened
		menumode = true;
		$("#poi, #story").tooltip('show');
    });

    $(document).on("menuclosed", function() {
        paused = false; // start map interactions when the menu is closed
        $(menuItems[curMenuItem]).css({
            "opacity": "1",
            "box-shadow": "none"
        }); // remove highlighting
		$("#poi, #story").tooltip('hide');
		menumode = false; // disable menumode
    });

    // slim scrollbar settings
    $('#gestures').slimScroll({
        height: "$(window).height()-250",
        color: '#f2f2f2',
        railVisible: false,
        railColor: 'white',
        railOpacity: 0.4
    });

    $("#gestures").height($(window).height() - 140); //gesture panel height

    // show tooltip when input field is focused
    $('input, textarea').tooltip({
        placement: "top",
        trigger: "focus"
    });
	
	// menu tooltips
	$('#story, #poi').tooltip({
        placement: "top",
		trigger: "manual"
    });
	
	// gesture tooltips
	$('#select, #lm, #close').tooltip({
        placement: "right",
		trigger: "manual",
		container: 'body'
    });

    // clear input fields in modal when its closed
    $('#POImodal, #story_elem_modal').on('hidden.bs.modal', function(e) {
        $('#poi_name, #poi_description, #story_elem_name, #story_elem_abstract, #story_elem_text').val("");
    })
	
	// remove POI when poi modal is closed
	$('#POImodal').on('hide.bs.modal', function(e) {
        remove_poi();
		$('#close').tooltip('hide');
    })
	
	// hide tooltip that tells how to create story elements for a story
	$('#story_elem_modal').on('shown.bs.modal', function(e) {
        $('#select').tooltip('hide');
		paused = true;
    })
	
	// show tooltip that tells how to create story elements for a story
	$('#story_elem_modal').on('hide.bs.modal', function(e) {
        $('#select').tooltip('show');
		$('#close').tooltip('hide');
    })
	
	// hide tooltip that tells how to create story elements for a story
	$('#story_submit_modal').on('shown.bs.modal', function(e) {
        $('#select').tooltip('hide');
		paused = true;
    })
	
	$('#story_submit_modal').on('hide.bs.modal', function(e) {
        $('#close').tooltip('hide');
    })
	
	// show tooltip on how to create a poi when hovering the corresponding menu item
	$('#poi').hover(function() {
		$('#lm').tooltip('toggle');
	});
	
	// enable map interaction when story modal closes
	$('#story_modal').on('hide.bs.modal', function(e) {
		paused = false;
		$('#close').tooltip('hide');
    })
	
	// show tooltip that tells how to close modals by swipe
	$('#story_elem_modal, #story_submit_modal, #POImodal, #story_modal').on('shown.bs.modal', function(e) {
        $('#close').tooltip('show');
    })
	
	// hide loader on page load
	$('#load').hide();
    init();
});