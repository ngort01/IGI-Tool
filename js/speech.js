var recognition = new webkitSpeechRecognition();
var final_transcript = '';
var interim_transcript = '';
var language = 'en-GB'; // TODO: fetch language as option value from drop down box // en-GB

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
    }

    console.log("interim: " + interim_transcript);
    console.log("final: " + final_transcript);
	document.getElementById("command").innerHTML =(interim_transcript);

    // update the web page
    if (final_transcript.length > 0) {
        $('#transcript').html("final:" + final_transcript);
    }

    if (interim_transcript.length > 0) {
        $('#interim').html("interim:" + interim_transcript);
    }

    // handling commands

    //////////////////////////////////////////////////////////
    /////Start using navigation controls//////////////////////
    //////////////////////////////////////////////////////////
    if (final_transcript.indexOf("zoom in") >= 0) {
        // Code for zooming in
        m.map.zoomIn(1);
        console.log("Zoomed in");
        final_transcript = '';
    }

    if (final_transcript.indexOf("zoom out") >= 0) {
        // Code for zooming out
        m.map.zoomOut(1);
        console.log("Zoomed out");
        final_transcript = '';
    }
    if ((final_transcript.indexOf("left") >= 0) 
		|| (final_transcript.indexOf("net") >= 0) 
		|| (final_transcript.indexOf("next") >= 0)) {
        centerPoint = m.map.getCenter();
        var delta = (m.map.getBounds().getEast() - m.map.getBounds().getWest()) / 4;
        centerPoint.lng -= Math.abs(delta);
        m.map.panTo(centerPoint);
        //console.log("Panned Left by "); // + Math.abs(m));
        final_transcript = '';
    }

    if ((final_transcript.indexOf("right") >= 0) || (final_transcript.indexOf("white") >= 0) || (final_transcript.indexOf("fight") >= 0)) {
        centerPoint = m.map.getCenter();
        var delta = (m.map.getBounds().getEast() - m.map.getBounds().getWest()) / 4;
        centerPoint.lng += Math.abs(delta);
        m.map.panTo(centerPoint);
        //console.log("Panned right by "); // + Math.abs(m));
        final_transcript = '';
    }

    if ((final_transcript.indexOf("up") >= 0) 
		|| (final_transcript.indexOf("apple") >= 0)
		|| (final_transcript.indexOf("app") >= 0)) {

        centerPoint = m.map.getCenter();
        var delta = (m.map.getBounds().getNorth() - m.map.getBounds().getSouth()) / 4;
        centerPoint.lat += delta;
        m.map.panTo(centerPoint);
        //console.log("Panned up by "); // + Math.abs(m));
        final_transcript = '';
    }

    if (final_transcript.indexOf("down") >= 0) {
        centerPoint = m.map.getCenter();
        var delta = (m.map.getBounds().getNorth() - m.map.getBounds().getSouth()) / 4;
        centerPoint.lat -= delta;
        m.map.panTo(centerPoint);
        //console.log("Panned down by "); //+ Math.abs(m));
        final_transcript = '';
    }
}

function speechButton(event) {
    final_transcript = '';
    recognition.start();
}