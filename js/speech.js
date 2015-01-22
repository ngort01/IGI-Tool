var recognition = new webkitSpeechRecognition();
var final_transcript = '';
var interim_transcript = '';
var language = 'en-GB'; // TODO: fetch language as option value from drop down box // en-GB
var mapControling = true;
var recName = false;
var recDescription = false;
var description = '';

recognition.continuous = true; // keep processing input until stopped
recognition.interimResults = true; // show interim results
recognition.lang = language; // specify the language

recognition.onresult = function(event) {
	$('#load').show();
    // Assemble the transcript from the array of results
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript = event.results[i][0].transcript;
        } else {
            interim_transcript = event.results[i][0].transcript;
        }

    }
	

    //console.log("final: " + final_transcript);

	document.getElementById("final_command").innerHTML =("");
	


    // handling commands
    //////////////////////////////////////////////////////////
    /////Start recording POI Name and Description//////////////
    //////////////////////////////////////////////////////////
	
	if ((recDescription) && ((final_transcript.indexOf("submit")>=0)
	|| (final_transcript.indexOf("sum") >= 0))){
		recDescription = false;
		$("#poi_form_submit").click();
		submit_POI();
		turnOnMapControlsPerSpeech();
		//console.log("Dictation completed.");
		final_transcript = '';
		description='';
		document.getElementById("final_command").innerHTML =("POI submitted");
		$('#load').hide(); // hide loader element
	}
	
	if ((recDescription) && ((final_transcript.indexOf("close")>=0)
					|| (final_transcript.indexOf("clothes")>=0)
					|| (final_transcript.indexOf("jaws")>=0))) {
		$("#poi_form_close").click();
		turnOnMapControlsPerSpeech();
		//console.log("formular closed.");
		recDescription=false;
		description = '';
		document.getElementById("final_command").innerHTML =("POI closed");
		$('#load').hide(); // hide loader element
	}
	
	if ((recDescription) && ((final_transcript.length)>0)) {
		description = description + capitalize(final_transcript) + ".";
		$("#poi_description").val(description);
		//console.log("\"Description\"-Field augmented.");
		final_transcript = '';
		$('#load').hide(); // hide loader element
	}

	
	if ((recName) && ((final_transcript.length)>0)) {
		$("#poi_name").val(capitalize(final_transcript));
		recName = false;
		recDescription = true;
		//console.log("\"Name\"-Field filled.");
		final_transcript = '';
		$('#poi_description').focus();
		$('#load').hide(); // hide loader element
	}
	

    //////////////////////////////////////////////////////////
    /////Start using navigation controls//////////////////////
    //////////////////////////////////////////////////////////
    if ((final_transcript.indexOf("zoom in") >= 0)
	|| (final_transcript.indexOf("zombie") >= 0) && (mapControling)) {
        // Code for zooming in
        m.map.zoomIn(1);
        //console.log("Zoomed in");
		document.getElementById("final_command").innerHTML =("Zoomed in");
		final_transcript = '';
		$('#load').hide(); // hide loader element
    }

    if ((final_transcript.indexOf("zoom out") >= 0)&& (mapControling)){
        // Code for zooming out
        m.map.zoomOut(1);
        //console.log("Zoomed out");
		document.getElementById("final_command").innerHTML =("Zoomed out");
		final_transcript = '';
		$('#load').hide(); // hide loader element
    }
	
    if (((final_transcript.indexOf("left") >= 0) 
		|| (final_transcript.indexOf("net") >= 0) 
		|| (final_transcript.indexOf("live") >= 0)
		|| (final_transcript.indexOf("lift") >= 0))		&& (mapControling)) {
        centerPoint = m.map.getCenter();
        var delta = (m.map.getBounds().getEast() - m.map.getBounds().getWest()) / 4;
        centerPoint.lng -= Math.abs(delta);
        m.map.panTo(centerPoint);
        //console.log("Panned Left by " + Math.abs(delta));
		document.getElementById("final_command").innerHTML =("panned left");
        final_transcript = '';
		$('#load').hide(); // hide loader element
    }

    if (((final_transcript.indexOf("right") >= 0) 
		|| (final_transcript.indexOf("white") >= 0) 
		|| (final_transcript.indexOf("fight") >= 0)
		|| (final_transcript.indexOf("riot") >= 0)
		|| (final_transcript.indexOf("Ryian") >= 0)
		|| (final_transcript.indexOf("light") >= 0))		&& (mapControling)) {
        centerPoint = m.map.getCenter();
        var delta = (m.map.getBounds().getEast() - m.map.getBounds().getWest()) / 4;
        centerPoint.lng += Math.abs(delta);
        m.map.panTo(centerPoint);
        //console.log("Panned right by " + Math.abs(delta));
		document.getElementById("final_command").innerHTML =("panned right");
        final_transcript = '';
		$('#load').hide(); // hide loader element
    }

    if (((final_transcript.indexOf("up") >= 0) 
		|| (final_transcript.indexOf("apple") >= 0)
		|| (final_transcript.indexOf("app") >= 0)) && (mapControling)){

        centerPoint = m.map.getCenter();
        var delta = (m.map.getBounds().getNorth() - m.map.getBounds().getSouth()) / 4;
        centerPoint.lat += delta;
        m.map.panTo(centerPoint);
        //console.log("Panned up by " + Math.abs(delta));
		document.getElementById("final_command").innerHTML =("panned up");
        final_transcript = '';
		$('#load').hide(); // hide loader element
    }

    if (((final_transcript.indexOf("down") >= 0)
		|| (final_transcript.indexOf("dawn") >= 0)) && (mapControling)){
        centerPoint = m.map.getCenter();
        var delta = (m.map.getBounds().getNorth() - m.map.getBounds().getSouth()) / 4;
        centerPoint.lat -= delta;
        m.map.panTo(centerPoint);
        //console.log("Panned down by " + Math.abs(delta));		
		document.getElementById("final_command").innerHTML =("panned down");
        final_transcript = '';
		$('#load').hide(); // hide loader element
    }
	
	//////////////////////////////////////////////////////////
    /////  navigation controls Tutorial//////////////////////
    //////////////////////////////////////////////////////////
    if ((final_transcript.indexOf("next") >= 0) && (mapControling)) {
        // Code for navigate tutorial
        tour.next();
        //console.log("Next");
		document.getElementById("final_command").innerHTML =("Next step");
		final_transcript = '';
		$('#load').hide(); // hide loader element
    }
	
	    if ((final_transcript.indexOf("previous") >= 0) && (mapControling)) {
        // Code for navigate tutorial
        tour.prev();
        //console.log("previous");
		document.getElementById("final_command").innerHTML =("Previous step");
		final_transcript = '';
		$('#load').hide(); // hide loader element
    }
	
		if (((final_transcript.indexOf("end") >= 0)
			|| (final_transcript.indexOf("evans")) >= 0) && (mapControling)) {
        // Code for navigate tutorial
        tour.end();
        //console.log("End");
		document.getElementById("final_command").innerHTML =("End tour");
		final_transcript = '';
		$('#load').hide(); // hide loader element
    }
}

// capitalize the first letter
var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function speechButton(event) {
    final_transcript = '';
    recognition.start();
}

function turnOnMapControlsPerSpeech(){
	mapControling = true;
	console.log("Turning on Speech Map Controls");
}

function turnOffMapControlsPerSpeech(){
	mapControling = false;
	console.log("Turning off Speech Map Controls");
}

function startFormRecording(){
	$('#POImodal').on('shown.bs.modal', function () {
		$('#poi_name').focus();
	})
	recName = true;
	recDescription = false;
	turnOffMapControlsPerSpeech();
	console.log("\"Name\"-Field focused.");
	final_transcript = '';
}

function stopFormRecording(){
	recName = false;
	recDescription = false;
	turnOnMapControlsPerSpeech();
	final_transcript = '';
}