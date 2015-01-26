var interim_transcript = '';
var mapControling = true;
var recName = false;
var recDescription = false;
var description = '';
var final_transcript = "";

var webSpeech = function() {
    var recognition = new webkitSpeechRecognition();
	recognition.onstart = function(event) {$("#voice_help").show();}
	recognition.onend = function(event) {$("#voice_help").hide();}

    function voiceStart(event) {
        $('#load').show();
		document.getElementById("final_command").style.color="black";
    }


    function voiceEnd(event) {
        $('#load').hide();
        count = 0;
    }

    var count = 0;

    function detect(event) {
        count++;



        console.log("listening ... " + count);
        //console.log(event);

        for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {

                final_transcript = event.results[i][0].transcript.replace(/^\s+|\s+$/g, '');
                console.log(final_transcript);

                //////////////////////////////////////////////////////////
                /////Start using navigation controls//////////////////////
                //////////////////////////////////////////////////////////
                if (mapControling) { // check for map controling mode 
                    if ((final_transcript.indexOf("zoom in") >= 0) || (final_transcript.indexOf("zombie") >= 0)) {
                        // Code for zooming in
                        m.map.zoomIn(1);
                        //console.log("Zoomed in");
                        document.getElementById("final_command").innerHTML = ("Zoomed in");
                        final_transcript = '';
                        $('#load').hide(); // hide loader element
                    } else if ((final_transcript.indexOf("zoom out") >= 0)) {
                        // Code for zooming out
                        m.map.zoomOut(1);
                        //console.log("Zoomed out");
                        document.getElementById("final_command").innerHTML = ("Zoomed out");
                        final_transcript = '';
                        $('#load').hide(); // hide loader element
                    } else if ((final_transcript.indexOf("left") >= 0) || (final_transcript.indexOf("net") >= 0) || (final_transcript.indexOf("live") >= 0) || (final_transcript.indexOf("lift") >= 0) || (final_transcript.indexOf("let") >= 0)) {
                        centerPoint = m.map.getCenter();
                        var delta = (m.map.getBounds().getEast() - m.map.getBounds().getWest()) / 4;
                        centerPoint.lng -= Math.abs(delta);
                        m.map.panTo(centerPoint);
                        //console.log("Panned Left by " + Math.abs(delta));
                        document.getElementById("final_command").innerHTML = ("panned left");
                        final_transcript = '';
                        $('#load').hide(); // hide loader element
                    } else if ((final_transcript.indexOf("right") >= 0) || (final_transcript.indexOf("white") >= 0) || (final_transcript.indexOf("fight") >= 0) || (final_transcript.indexOf("riot") >= 0) || (final_transcript.indexOf("Ryian") >= 0) || (final_transcript.indexOf("light") >= 0) || (final_transcript.indexOf("ride") >= 0)) {
                        centerPoint = m.map.getCenter();
                        var delta = (m.map.getBounds().getEast() - m.map.getBounds().getWest()) / 4;
                        centerPoint.lng += Math.abs(delta);
                        m.map.panTo(centerPoint);
                        //console.log("Panned right by " + Math.abs(delta));
                        document.getElementById("final_command").innerHTML = ("panned right");
                        final_transcript = '';
                        $('#load').hide(); // hide loader element
                    } else if ((final_transcript.indexOf("up") >= 0) || (final_transcript.indexOf("apple") >= 0) || (final_transcript.indexOf("app") >= 0)) {
                        centerPoint = m.map.getCenter();
                        var delta = (m.map.getBounds().getNorth() - m.map.getBounds().getSouth()) / 4;
                        centerPoint.lat += delta;
                        m.map.panTo(centerPoint);
                        //console.log("Panned up by " + Math.abs(delta));
                        document.getElementById("final_command").innerHTML = ("panned up");
                        final_transcript = '';
                        $('#load').hide(); // hide loader element
                    } else if ((final_transcript.indexOf("down") >= 0) || (final_transcript.indexOf("dawn") >= 0)) {
                        centerPoint = m.map.getCenter();
                        var delta = (m.map.getBounds().getNorth() - m.map.getBounds().getSouth()) / 4;
                        centerPoint.lat -= delta;
                        m.map.panTo(centerPoint);
                        //console.log("Panned down by " + Math.abs(delta));		
                        document.getElementById("final_command").innerHTML = ("panned down");
                        final_transcript = '';
                        $('#load').hide(); // hide loader element
					} else if ((final_transcript.indexOf("help me") >= 0)) {
						$('#voice_help').popover('show');
					} else if ((final_transcript.indexOf("thank you") >= 0)) {
						$('#voice_help').popover('hide');
					} else if ((final_transcript.indexOf("start tutorial") >= 0)) {
						tour.restart(); 
						tutorial = true;
					//////////////////////////////////////////////////////////
					/////////////////////// Multimodal////////////////////////
					//////////////////////////////////////////////////////////
                    } else if ((final_transcript.indexOf("create marker") >= 0)) {
						if (newCenter) {
							POI = L.marker(newCenter);
							pois.addLayer(POI);
							$('#POImodal').modal('toggle') // open poi creation form
							startFormRecording();
							$("#poi_lat").val(POI.getLatLng().lat); // insert coordinates into the poi creation form
							$("#poi_lon").val(POI.getLatLng().lng);
							paused = true;
						} else { // error handling
							document.getElementById("final_command").innerHTML = ("Hand position not found!");
							document.getElementById("final_command").style.color="red";
						}
					} else if ((final_transcript.indexOf("click") >= 0) || (final_transcript.indexOf("pig") >= 0)) {
						if (handMarker) {
							pois.eachLayer(function (layer) {
								if (handMarker.getBounds().contains(layer.getLatLng())) {
									layer.fireEvent("click");
								}
							});
						} else { // error handling
							document.getElementById("final_command").innerHTML = ("Hand position not found!");
							document.getElementById("final_command").style.color="red";
						}
					}
                }

                //////////////////////////////////////////////////////////
                /////Start recording POI Name and Description//////////////
                //////////////////////////////////////////////////////////
                if ((recDescription) && ((final_transcript.indexOf("submit") >= 0) || (final_transcript.indexOf("sum") >= 0))) {
                    recDescription = false;
                    $("#poi_form_submit").click();
                    submit_POI();
                    turnOnMapControlsPerSpeech();
                    //console.log("Dictation completed.");
                    final_transcript = '';
                    description = '';
                    document.getElementById("final_command").innerHTML = ("POI submitted");
                    $('#load').hide(); // hide loader element
                } else if ((recDescription) && ((final_transcript.indexOf("close") >= 0) || (final_transcript.indexOf("clothes") >= 0) || (final_transcript.indexOf("jaws") >= 0))) {
                    $("#poi_form_close").click();
                    turnOnMapControlsPerSpeech();
                    //console.log("formular closed.");
                    recDescription = false;
                    description = '';
                    document.getElementById("final_command").innerHTML = ("POI closed");
                    $('#load').hide(); // hide loader element
                } else if ((recDescription) && ((final_transcript.length) > 0)) {
                    description = description + capitalize(final_transcript) + ".";
                    $("#poi_description").val(description);
                    //console.log("\"Description\"-Field augmented.");
                    final_transcript = '';
                    $('#load').hide(); // hide loader element
                } else if ((recName) && ((final_transcript.length) > 0)) {
                    $("#poi_name").val(capitalize(final_transcript));
                    recName = false;
                    recDescription = true;
                    //console.log("\"Name\"-Field filled.");
                    final_transcript = '';
                    $('#poi_description').focus();
                    $('#load').hide(); // hide loader element
                }


                //////////////////////////////////////////////////////////
                /////  navigation controls Tutorial//////////////////////
                //////////////////////////////////////////////////////////
                if (tutorial) { // check for tutorial mode
                    if ((final_transcript.indexOf("next") >= 0)) {
                        tour.next();
                        //console.log("Next");
                        document.getElementById("final_command").innerHTML = ("Next step");
                        final_transcript = '';
                        $('#load').hide(); // hide loader element
                    } else if ((final_transcript.indexOf("previous") >= 0)) {
                        // Code for navigate tutorial
                        tour.prev();
                        //console.log("previous");
                        document.getElementById("final_command").innerHTML = ("Previous step");
                        final_transcript = '';
                        $('#load').hide(); // hide loader element
                    } else if (((final_transcript.indexOf("end") >= 0) || (final_transcript.indexOf("evans")) >= 0)) {
                        tutorial = false;
                        tour.end();
                        //console.log("End");
                        document.getElementById("final_command").innerHTML = ("End tour");
                        final_transcript = '';
                        $('#load').hide(); // hide loader element
                    }
                }
                // void command ended
                voiceEnd(event);
            } else {
                voiceStart();
            }
        }
    }

    // capitalize the first letter
    var first_char = /\S/;

    function capitalize(s) {
        return s.replace(first_char, function(m) {
            return m.toUpperCase();
        });
    }

    return {
        listen: function() {
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-GB";
            recognition.onresult = detect;
            recognition.start();
        }
    };
}();


//webSpeech.listen();

function speechButton(event) {
    final_transcript = '';
    webSpeech.listen();
}

function startFormRecording() {
    $('#POImodal').on('shown.bs.modal', function() {
        $('#poi_name').focus();
    });
    recName = true;
    recDescription = false;
    turnOffMapControlsPerSpeech();
    console.log("\"Name\"-Field focused.");
    final_transcript = '';
}

function stopFormRecording() {
    recName = false;
    recDescription = false;
    turnOnMapControlsPerSpeech();
    final_transcript = '';
}

function turnOnMapControlsPerSpeech() {
    mapControling = true;
    console.log("Turning on Speech Map Controls");
}

function turnOffMapControlsPerSpeech() {
    mapControling = false;
    console.log("Turning off Speech Map Controls");
}