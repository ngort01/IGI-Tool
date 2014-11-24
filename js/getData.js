var db_url = "https://api.mongolab.com/api/1/databases/igi-tool-db";
var poi_url = db_url + "/collections/pois";
var api_key = "2Q1SmomE3Hihh_MqC4nshAwWRowZSeiT";

// layer group for all the pois
var pois = L.layerGroup();

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
	var lat = obj.location.coordinates[0], lon = obj.location.coordinates[1];
	// check for invalid coordinates
	if (!lat == "" && !lon == "") {
		var p = new L.marker([lat, lon], {
			title: obj.name
		});
		p.bindPopup("Name: " + obj.name + 
					"<br> ID: " + obj._id.$oid +
					"<br> Description: " + obj.description);
		pois.addLayer(p);
	}
}
