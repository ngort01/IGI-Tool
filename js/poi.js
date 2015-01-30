/**
All functions related to POI's 
**/
var db_url = "https://api.mongolab.com/api/1/databases/igi-tool-db";
var poi_url = db_url + "/collections/pois";
var api_key = "";

// layer group for all the pois
var pois = new L.MarkerClusterGroup();

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
        p.bindPopup("<p><b>"+ obj.name+"<hr></b></p>"
        		+ createPoiImageList(obj)
        		+ "<hr>"
        		+ obj.description);
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
					+ '" alt="' + pic.name + '" width="50" height="50"/>';
			}
		} else {
			
			var pic = poi.picture;
			img_list += '<img src="' + getImage_url + '?oid=' + pic.data.$oid
			+ '" alt="' + pic.name + '" width="50" height="50"/>';
		}
	}
	return img_list;
}

/**
Inserts POI into the database 
TO DO: handle cases with and without media
**/
function addPoi(name, description, lat, lon) {

    jQuery.ajax({
        url: poi_url + "?apiKey=" + api_key,
        data: JSON.stringify({
            "name": name,
            "description": description,
            "location": {
                "type": "Point",
                "coordinates": [lat, lon]
            }
        }),
        type: "POST",
        async: true,
        contentType: "application/json;charset=utf-8",
        success: function(data) {
            pois.clearLayers();
            getPois();
            console.log(data);
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
	var layers = pois.getLayers();
	var id = layers[layers.length-1]._leaflet_id;
	pois.eachLayer(function (layer) {
		if (layer._leaflet_id === id){
			pois.removeLayer(layer)
		}
	});
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
    addPoi(name, descr, lat, lon);
    $('#POImodal').modal('toggle');
}
