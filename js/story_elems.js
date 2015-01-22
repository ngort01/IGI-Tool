/**
All functions related to story elements 
**/
var story_elem_url = db_url + "/collections/story-elements";


/**
Inserts story element into the database 
TO DO: handle cases with and without media
@params:
	f: optional function to be called on success
**/
function addStoryElement(poi_id, name, tag_id, abstr, text, f) {
    jQuery.ajax({
        url: story_elem_url + "?apiKey=" + api_key,
        data: JSON.stringify({
            "poi_id": {
                "$oid": poi_id
            },
            "name": name,
            "tag_id": {
                "$oid": tag_id
            },
            "text": text,
            "abstract": abstr
        }),
        type: "POST",
        async: true,
        contentType: "application/json;charset=utf-8",
        success: function(data) {
            story_elem_ids.push(data._id.$oid); // get back the story element ID and push on the stack
			story_elem_names.push(data.name);
            console.log(story_elem_ids);
            console.log(story_elem_ids[story_elem_ids.length - 1]);
            console.log(story_elem_names);
            if (f) f();
        },
        error: function(xhr, status, err) {
            alert("Item '" + name + "' couldn't be added to database.");
        }
    });
}


/**
Remove story element from database
**/
function deleteStoryElement(id) {

    jQuery.ajax({
        url: story_elem_url + "/" + id + "?apiKey=" + api_key,
        type: "DELETE",
        async: true,
        timeout: 300000,
        success: function(data) {

        },
        error: function(xhr, status, err) {
			alert("Item '" + id + "' couldn't be removed.");
        }
    });
    
}




/**
Submit story element information
**/
function submit_story_elem(f) {
    var name = $("#story_elem_name").val();
    var abstr = $("#story_elem_abstract").val();
    var text = $("#story_elem_text").val();
    var poi_id = $("#poi_id").val();
    var tag_id = "54845912e4b05a496d0c5f4e"; //placeholder...!!!
    addStoryElement(poi_id, name, tag_id, abstr, text, f);
    $('#story_elem_modal').modal('toggle');
    paused = false; // enable map interaction
}



/**
Fill story submit modal
Modal with all information of the story. Last check before submitting
**/
function story_submit_modal() {
    storyline.spliceLatLngs(0, storyline.getLatLngs().length); // clear lines
    $('#story_submit_modal').modal('toggle');
    $("#story_submit_description").val($("#story_description").val());
    $("#story_submit_name").val($("#story_name").val());
    var tbl_body = ""; // html table content (story elements summary)
    console.log(story_elem_names);
    for (var i = 0; i < story_elem_names.length; i++) {
        var tbl_row = "";
        var query = "";
        tbl_row = "<td>" + (i+1) + "</td><td>" + story_elem_names[i] + "</td>";
        tbl_body += "<tr>" + tbl_row + "</tr>"; // fill table body
    }
    $("#elem_table tbody").html(tbl_body); //insert into body of table
}