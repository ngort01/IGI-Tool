/**
 * 
 * functions to upload a single image to the database
 */

// //////////////////////////////////////////////////
// VARIABLES

var base_url 		= "http://GIV-INTERACTION.uni-muenster.de";
var uploadImg_url	= base_url + "/dbml/uploadImg.php";
var getImage_url	= base_url + "/dbml/getImage.php";
var updatePoi_url	= base_url + "/dbml/updatePoi.php";

var poi_img_list = new Array();


// //////////////////////////////////////////////////
// USER INTERFACE

/**
 * add an entry to the table of uploaded files
 */
function addFileToTable(name, size, img_url) {
	
	// add header, when first file is added
	if (jQuery("#poi_img_table_header").html().length == 0) {
		jQuery("#poi_img_table_header").append(
				"<tr><th></th><th>Name</th><th>Size (Bytes)</th></tr>"		
			);
	}
	// insert row
	jQuery("#poi_img_table").append(
		"<tr><td><img src='" + img_url + "' width='24' height='24' /></td>"
		+ "<td>" + name + "</td><td>" + size + "</td></tr>"		
	);
}

/**
 * handle progress bar
 */
function progressBarHandler(e) {
	if (e.lengthComputable) {
		var val = e.loaded / e.total * 100;
		
		jQuery("#poi_img_progbar")
			.attr("aria-valuenow", val)
			.attr("style", "width: " + val + "%;");
	}
}


// //////////////////////////////////////////////////
// UPLOAD

/**
 * validate file before upload
 */
//jQuery("#new-img-file").change( function() {
//	
//		var file = this.files[0];
//		var name = file.name;
//		var size = file.size;
//		var type = file.type;
//
//		// TODO pre-validation
//		
//		// TODO limit size
// 					var sizeRemark = "";
//					if (size > 500000) {
//						
//					} else if (size < 50000) {
//						
//					}
//	}
//);

/**
 * concat submit URL
 */
function getSubmitUrl() {
	
	var submit_url = uploadImg_url
		+ "?result_mode=json"
		+ "&display_name=" + jQuery("#poi_img_name").val();
	
	return submit_url;
}

/**
 * submit image
 */
jQuery("#poi_img_add").click(function(){
	var formData = new FormData(jQuery("#poi_img_form")[0]);
	
	jQuery.ajax({ url: getSubmitUrl(),
		type: 'POST',
		xhr: function() {
		
			// Custom XMLHttpRequest
			var myXhr = jQuery.ajaxSettings.xhr();
			if (myXhr.upload) {
			
				// Check if upload property exists
				myXhr.upload.addEventListener('progress', progressBarHandler, false);
				// For handling the progress of the upload
			}
			return myXhr;
		},
		
		// Ajax events
		beforeSend: function(e) {
			
			jQuery("#poi_img_upload_status").html("Uploading...");
			jQuery("#poi_img_add").prop('disabled', true);
		},
		success: function(r) {
			console.log("Server response: " + JSON.stringify(r));

			var img_url = getImage_url + "?oid=" + r.id;
			addFileToTable(r.name, r.size, img_url);
			
			addToImgList(r.name, r.id);
			
			// reset form (not possible for poi_img_file)
			jQuery("#poi_img_name").val(null);
						
			jQuery("#poi_img_upload_status").html("Success!");
			jQuery("#poi_img_add").prop('disabled', false);
		},
		error: function(r) {
			console.err("Server response: " + JSON.stringify(r));
			
			jQuery("#poi_img_upload_status").html("Error!");
			jQuery("#poi_img_add").prop('disabled', false);
		},
		
		// Form data
		data: formData,
		
		// Options to tell jQuery not to process data or worry about content-type
		cache: false,
		contentType: false,
		processData: false
	});
});

/**
 * collect all the images to add image entries later
 * @param name
 * @param id
 */
function addToImgList(name, id) {
	
	poi_img_list.push({'name': name, 'data': {'$id': id}});
}

/**
 * add the images to an already created poi
 * @param poi_oid
 */
function addImagesToPoi(poi_oid) {
	
	// add images
	for (var img of poi_img_list) {
		var img2poi_params = "?oid=" + poi_oid + "&new_img_oid=" + img.data.$id + "&display_name=" + img.name;
		
		jQuery.ajax({
	        url: updatePoi_url + img2poi_params,
	        data: null,
	        type: "POST",
	        async: true,
	        contentType: "application/json;charset=utf-8",
	        success: function(data) {

	        },
	        error: function(xhr, status, err) {

	            alert("Image " + img.data.$id + " couldn't be added to POI " + poi_oid + ".");
	        }
	    });
	}
	
	// refresh poi
	pois.clearLayers();
    getPois(m.map);
	
	// clear lists
	img_list = new Array();
	jQuery("#poi_img_table").html("");
	jQuery("#poi_img_table_header").html("");
	jQuery("#poi_img_upload_status").html("");
}
