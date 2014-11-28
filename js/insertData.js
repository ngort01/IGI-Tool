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
        },
        error: function(xhr, status, err) {

            alert("POI '" + name + "' couldn't be added to database.");
        }
    });
}