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

    // Assemble the transcript from the array of results
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript = event.results[i][0].transcript;
        } else {
            interim_transcript = event.results[i][0].transcript;
        }
		//console.log("#" + i + ": " + event.results[i][0].transcript);
    }
	
    console.log("interim: " + interim_transcript);
    console.log("final: " + final_transcript);
	document.getElementById("final_interim").innerHTML =(interim_transcript);
	document.getElementById("final_command").innerHTML =("");
	
    // update the web page
    if (final_transcript.length > 0) {
        $('#transcript').html("final:" + final_transcript);
		
    }

    if (interim_transcript.length > 0) {
        $('#interim').html("interim:" + interim_transcript);
    }

    // handling commands
    //////////////////////////////////////////////////////////
    /////Start recording POI Name and Description//////////////
    //////////////////////////////////////////////////////////
	
	if ((recDescription) && (final_transcript.indexOf("submit")>=0)){
		recDescription = false;
		$("#poi_form_submit").click();
		submit_POI();
		turnOnMapControlsPerSpeech();
		console.log("Dictation completed.");
		final_transcript = '';
		description='';
	}
	
	if ((recDescription) && ((final_transcript.length)>0)) {
		description = description + final_transcript + ". ";
		$("#poi_description").val(description);
		console.log("\"Description\"-Field augmented.");
		final_transcript = '';
	}
	
	if ((recName) && ((final_transcript.length)>0)) {
		$("#poi_name").val(final_transcript);
		recName = false;
		recDescription = true;
		console.log("\"Name\"-Field filled.");
		final_transcript = '';
	}
	

    //////////////////////////////////////////////////////////
    /////Start using navigation controls//////////////////////
    //////////////////////////////////////////////////////////
    if ((final_transcript.indexOf("zoom in") >= 0) && (mapControling)) {
        // Code for zooming in
        m.map.zoomIn(1);
        console.log("Zoomed in");
		document.getElementById("final_command").innerHTML =("Zoomed in");
		final_transcript = '';
    }

    if ((final_transcript.indexOf("zoom out") >= 0) && (mapControling)){
        // Code for zooming out
        m.map.zoomOut(1);
        console.log("Zoomed out");
		document.getElementById("final_command").innerHTML =("Zoomed out");
		final_transcript = '';
    }
    if (((final_transcript.indexOf("left") >= 0) 
		|| (final_transcript.indexOf("net") >= 0) 
		|| (final_transcript.indexOf("next") >= 0)
		|| (final_transcript.indexOf("live") >= 0)
		|| (final_transcript.indexOf("lift") >= 0))		&& (mapControling)) {
        centerPoint = m.map.getCenter();
        var delta = (m.map.getBounds().getEast() - m.map.getBounds().getWest()) / 4;
        centerPoint.lng -= Math.abs(delta);
        m.map.panTo(centerPoint);
        console.log("Panned Left by " + Math.abs(delta));
		document.getElementById("final_command").innerHTML =("panned left");
        final_transcript = '';
		document.getElementById("final_interim").innerHTML =("left");
    }

    if (((final_transcript.indexOf("right") >= 0) 
		|| (final_transcript.indexOf("white") >= 0) 
		|| (final_transcript.indexOf("fight") >= 0)
		|| (final_transcript.indexOf("Riot") >= 0)
		|| (final_transcript.indexOf("Ryian") >= 0))		&& (mapControling)) {
        centerPoint = m.map.getCenter();
        var delta = (m.map.getBounds().getEast() - m.map.getBounds().getWest()) / 4;
        centerPoint.lng += Math.abs(delta);
        m.map.panTo(centerPoint);
        console.log("Panned right by " + Math.abs(delta));
		document.getElementById("final_command").innerHTML =("panned right");
        final_transcript = '';
		document.getElementById("final_interim").innerHTML =("right");
    }

    if (((final_transcript.indexOf("up") >= 0) 
		|| (final_transcript.indexOf("apple") >= 0)
		|| (final_transcript.indexOf("app") >= 0)) && (mapControling)){

        centerPoint = m.map.getCenter();
        var delta = (m.map.getBounds().getNorth() - m.map.getBounds().getSouth()) / 4;
        centerPoint.lat += delta;
        m.map.panTo(centerPoint);
        console.log("Panned up by " + Math.abs(delta));
		document.getElementById("final_command").innerHTML =("panned up");
        final_transcript = '';
		document.getElementById("final_interim").innerHTML =("up");
    }

    if (((final_transcript.indexOf("down") >= 0)
		|| (final_transcript.indexOf("dawn") >= 0)) && (mapControling)){
        centerPoint = m.map.getCenter();
        var delta = (m.map.getBounds().getNorth() - m.map.getBounds().getSouth()) / 4;
        centerPoint.lat -= delta;
        m.map.panTo(centerPoint);
        console.log("Panned down by " + Math.abs(delta));		
		document.getElementById("final_command").innerHTML =("panned down");
        final_transcript = '';
		document.getElementById("final_interim").innerHTML =("down");
    }
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