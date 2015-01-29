/**
All functions related to stories
**/
var story_url = db_url + "/collections/stories";
var creating_story = false; // shows that story creation mode is active
var story_elem_ids = []; // ids of a stories story elements
var story_elem_names = []; //names of a stories story elements

/**
Create story 
**/

function create_story() {
    creating_story = true; // entering story creation mode
    $('#story_modal').modal('toggle');
}



/**
Inserts story into the database 
TO DO: handle cases with and without media
**/
function addStory(name, description, story_elem_ids) {
    jQuery.ajax({
        url: story_url + "?apiKey=" + api_key,
        data: JSON.stringify({
            "name": name,
            "description": description,
            "story_element_id": [{
                "$oid": story_elem_ids[0]
            }]
        }),
        type: "POST",
        async: true,
        contentType: "application/json;charset=utf-8",
        success: function(data) {
            var story_id = data._id.$oid;
			for (var i = 1; i < story_elem_ids.length; i++) {
				var elem_id = story_elem_ids[i];
				add_elem_id(story_id, elem_id); // add remaing story elem ids to the story
			}
			story_elem_ids = []; // clear story elemet ids
			story_elem_names = [];
        },
        error: function(xhr, status, err) {
            alert("Item '" + name + "' couldn't be added to database.");
        }
    });
}


/**
Add story element ID to a story
**/
function add_elem_id(story_id, elem_id) {
	$.ajax({ 
		url: story_url + "/" + story_id + "?apiKey=" + api_key,
		data: JSON.stringify({
			"$push" : { "story_element_id" : {"$oid": elem_id} } 
		}),
		type: "PUT",
		contentType: "application/json" 
	});
}


/**
Submit story information
**/
function submit_story() {
    var story_name = $("#story_name").val();
    var story_description = $("#story_description").val();
    $('#story_submit_modal').modal('toggle');
    console.log(story_elem_ids);
    addStory(story_name, story_description, story_elem_ids); // add to database
    $("#story_name").val(""); //clear story modal input fields
    $("#story_description").val("");
    creating_story = false; // disable story creation mode
}

/**
Submit story information 
**/
function cancel_story() {
	$('#select').tooltip('hide');
    $("#story_name").val(""); //clear story modal input fields
    $("#story_description").val("");
    storyline.spliceLatLngs(0, storyline.getLatLngs().length);
    creating_story = false; // disable story creation mode
    for (var i = 0; i < story_elem_ids.length; i++) { // delete created story elements
        deleteStoryElement(story_elem_ids[i]);
    }
    story_elem_ids = [];
    story_elem_names = [];
}