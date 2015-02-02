/**
All functions related to POI's 
**/
var db_url = "https://api.mongolab.com/api/1/databases/igi-tool-db";
var poi_url = db_url + "/collections/pois";
var api_key = "";

// layer group for all the pois
var pois = new L.MarkerClusterGroup();

// image upload test
jQuery("#poi_img_add_dummy").click(function(){
	
	
	if (jQuery("#poi_img_table_header").html().length == 0) {
		jQuery("#poi_img_table_header").append(
				"<tr><th></th><th>Name</th><th>Size (Bytes)</th></tr>"		
			);
	}
	// insert dummy row
	jQuery("#poi_img_table").append(
		"<tr><td>+</td><td>" + jQuery("#poi_img_file").val() + "</td><td>1234 Dummy</td></tr>"		
	);
	
	// set progress bar
	var prog_val = getRandomInt(2, 100);
	jQuery("#poi_img_progbar")
		.attr("aria-valuenow", prog_val)
		.attr("style", "width: " + prog_val + "%;");
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
get and create pois
**/
function getPois(map) {
    jQuery.ajax({
        url: poi_url + "?apiKey=" + api_key,
        dataType: "json",
        async: true,
        type: "GET",
        success: function(data, status, jqXHR) {
            $.each(data, function(i, obj) {
                //console.log(obj);
                createPois(obj, map);
            });
            pois.addTo(map);
        }
    });
}


/**
creates marker and popup
**/
function createPois(obj, map) {
    var lat = obj.location.coordinates[0],
        lon = obj.location.coordinates[1];
    // check for invalid coordinates
    if (!lat == "" && !lon == "") {
        var p = L.marker([lat, lon], {
            title: obj._id.$oid
        });
        
        var img_list = createPoiImageList(obj);
        if (img_list !== "") {
	        p.bindPopup("<p><b>"+ obj.name+"<hr></b></p>"
	        		+ createPoiImageList(obj)
	        		+ "<hr>"
	        		+ obj.description);
        } else {
        	p.bindPopup("<p><b>"+ obj.name+"<hr></b></p>"
	        		+ obj.description);
        }
        
        p.on('click', function(e) {
            if (creating_story == true) { // if in story creation mode
                p.togglePopup(); // prevent popup from showing
                $('#story_elem_modal').modal('toggle'); // open story element modal
                $("#poi_id").val(e.target.options.title); // insert ID of the selected POI into the modal
				storyline.addLatLng(p.getLatLng()); // connect story elements to keep track of progress
            }
        });
        pois.addLayer(p);
    }
}

/**
show images to one poi
**/
function createPoiImageList(poi) {
	
	var img_list = "";
	
	if (typeof poi.picture != "undefined") {
		var getImage_url = "http://GIV-INTERACTION.uni-muenster.de/dbml/getImage.php";
		
		if (poi.picture instanceof Array) {
		
			for (var pic of poi.picture) {
				
				img_list += '<img src="' + getImage_url + '?oid=' + pic.data.$oid
					+ '" alt="' + pic.name + '" width="50" height="50" style="padding:1px" />';
			}
		} else {
			
			var pic = poi.picture;
			img_list += '<img src="' + getImage_url + '?oid=' + pic.data.$oid
				+ '" alt="' + pic.name + '" width="50" height="50" style="padding:1px" />';
		}
	}
	return img_list;
}

/**
Inserts POI into the database 
TO DO: handle cases with and without media
**/
function addPoi(name, description, lat, lon) {
	
	addPoi(name, description, lat, lon, null);
}

function addPoi(name, description, lat, lon, image_array) {

	var json_data = JSON.stringify({
            "name": name,
            "description": description,
            "location": {
                "type": "Point",
                "coordinates": [lat, lon]
            }
        });
	
    jQuery.ajax({
        url: poi_url + "?apiKey=" + api_key,
        data: json_data,
        type: "POST",
        async: true,
        contentType: "application/json;charset=utf-8",
        success: function(data) {
        	addImagesToPoi(data._id.$oid);
            pois.clearLayers();
            getPois(m.map);
        },
        error: function(xhr, status, err) {

            alert("POI '" + name + "' couldn't be added to database.");
        }
    });
}

/**
remove last added POI from the map
**/
function remove_poi() {
	if (pois.hasLayer(POI)){
		pois.removeLayer(POI);
	}
}


/**
Set POI on the map by mouse click 
**/

function setPOI(e) {
    POI = new L.marker(e.latlng);
    pois.addLayer(POI);
    m.map.off('click', setPOI); // turn off map event
    $('#POImodal').modal('toggle'); // open poi creation form
    $("#poi_lat").val(POI.getLatLng().lat); // insert coordinates into the poi creation form
    $("#poi_lon").val(POI.getLatLng().lng);
}


/**
Submit POI information
**/

function submit_POI() {
    var name = $("#poi_name").val();
    var lat = parseFloat($("#poi_lat").val());
    var lon = parseFloat($("#poi_lon").val());
    var descr = $("#poi_description").val();
    addPoi(name, descr, lat, lon, poi_img_list);
    $('#POImodal').modal('toggle');
}
