var newCenter; // leaflet coordinates of the stabilizedPalmPosition
/**
Gestures and corresponding map events
**/
(function() {

    LeapController.prototype.ws = null;

    var MAX_ZOOM = 18;
    var self;
    var LEFT_HAND = 0,
        RIGHT_HAND = 1;
    var leftHandPrev;
    var INDEX_FINGER = 1;
    var handMarkers = [];
    var HEIGHT_OFFSET = 150;
    var BASE_MARKER_SIZE_GRIPPED = 350000,
        BASE_MARKER_SIZE_UNGRIPPED = 500000;
    var zoomLevelAtCircleStart;
    // axis of the leap motion
    var X = 0,
        Y = 1,
        Z = 2;
	

    function LeapController(map) {
        self = this;
        self.map = map;
    }

    LeapController.prototype.init = function() {

        self.map.on('zoomstart', function(e) {
            self._isZooming = true;
        });

        self.map.on('zoomend', function(e) {
            self._isZooming = false;
        });

        //Initialize leap loop
        var controllerOptions = {
             enableGestures: true, frameEventName: 'animationFrame'
        };
		
        Leap.loop(controllerOptions, function(frame) {
			if (!paused) { // map interactions paused if menu is opened
            // handmarkers
            markHands(frame)

            move(frame);

            if (self._isZooming) {
                return; // Skip this update
            }

            /////////////////////// GESTURES WITH ONE HAND ////////////////////////////////////////
            if (frame.hands != null && frame.hands.length == 1) {
                //Check for gestures - zoom in / out
                if (frame.gestures != null && frame.gestures.length > 0) {
                    for (var x = 0; x < frame.gestures.length; x++) {
                        var gesture = frame.gestures[x];
                        if (gesture.type == "circle") {
                            zoom(frame, gesture);
						//Check for gestures - open/close marker
                        } else if (gesture.type == "screenTap" && frame.pointable(gesture.pointableIds[0]).type == INDEX_FINGER
									&& gesture.duration > 100000) {
							console.log("DONE!");
							pois.eachLayer(function (layer) {
								if (handMarker.getBounds().contains(layer.getLatLng())) {
								 layer.fireEvent("click");
								}
							});
                        } else if (gesture.type == "swipe" && frame.hands[0].type == "left") {
							//Classify swipe as either horizontal or vertical
							var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
							if(isHorizontal){
								if(gesture.direction[0] > 0){
									swipeDirection = "right";
								} else {
									swipeDirection = "left";
								}
							} else { //vertical
								if(gesture.direction[1] > 0){ // swipe up -> scroll down
									//console.log("swipe");
									$('#gestures').slimScroll({ scrollBy: '20px' });
								} else { // swipe down -> scroll up
									$('#gestures').slimScroll({ scrollBy: '-20px' });
								}
							}
						} 
                    }
                } ///////////////////////////// GESTURES WITH TWO HANDS	////////////////////////////////////////
			} else if (frame.hands != null && frame.hands.length == 2) {
				toggleMenu(frame);
				}
			} else { // if paused
				if (frame.hands != null && frame.hands.length == 2) {
					toggleMenu(frame);
				}
				controlMenu(frame);
				closeModal(frame);
			} 
			
			// place POI by pinching
			if (frame.hands != null && frame.hands.length > 0) {
				if (frame.hands[0].pinchStrength > 0.9 && settingPOI == true) {
					POI.setLatLng(newCenter);
				} else if (frame.hands[0].pinchStrength == 0 && settingPOI == true) {
					$('#lm').tooltip('toggle');
					settingPOI = false;
					$('#POImodal').modal('toggle') // open poi creation form
					$("#poi_lat").val(POI.getLatLng().lat); // insert coordinates into the poi creation form
					$("#poi_lon").val(POI.getLatLng().lng);
					paused = true;
				}
			}
        });
    }

	
	///////////////////////////////////////////////////
	///////////////////Map Controls ///////////////////
	///////////////////////////////////////////////////
	

    /**
	Represent hands as circles on the map
	**/
    function markHands(frame) {
        var scaling = (4.0 / Math.pow(2, self.map.getZoom() - 1));

        var bounds = self.map.getBounds();
        if (!bounds) {
            return;
        }

        var origin = L.latLng(bounds.getSouthWest().lat, bounds.getCenter().lng);
        var hands = frame.hands;
        //console.log(hands);
        for (var i in hands) {
            if (hands.hasOwnProperty(i)) {
                // 2 hands max
                if (i > RIGHT_HAND) {
                    return;
                }

                var hand = hands[i];
                newCenter = L.latLng(origin.lat + ((hand.stabilizedPalmPosition[1] - HEIGHT_OFFSET) * scaling), origin.lng + (hand.stabilizedPalmPosition[0] * scaling));

                var gripped = isGripped(hand);
                var baseRadius = gripped ? BASE_MARKER_SIZE_GRIPPED : BASE_MARKER_SIZE_UNGRIPPED;

                handMarker = handMarkers[i];
                if (!handMarker) {
                    handMarker = new L.circle(newCenter, baseRadius * scaling);
                    handMarkers[i] = handMarker;
                }

                handMarker.setLatLng(newCenter);
                handMarker.setRadius(baseRadius * scaling);
                handMarker.setStyle({
                    color: getHandColor(hand),
                    opacity: 0.8,
                    strokeWeight: 2,
                    fill: true,
                    fillColor: getHandColor(hand),
                    fillOpacity: 0.35,
                });
                //handMarker.addTo(self.map)
            }
            handMarker.addTo(self.map)
        }
    }

    /**
	Zoom in/out if circle gesture is performed clockwise/ anticlockwise
	**/
    function zoom(frame, circleGesture) {
        // Only zoom based on one index finger
        if (circleGesture.pointableIds.length == 1 &&
            frame.pointable(circleGesture.pointableIds[0]).type == INDEX_FINGER) {
            switch (circleGesture.state) {
                case "start":
                    zoomLevelAtCircleStart = self.map.getZoom();
                    // fall through on purpose...
                case "update":
                    // figure out if we need to change the zoom level;
                    var zoomChange = Math.floor(circleGesture.progress);
                    var currentZoom = self.map.getZoom();
                    var zoomDirection = isClockwise(frame, circleGesture) ? zoomChange : -zoomChange;
                    if (zoomLevelAtCircleStart + zoomDirection != currentZoom) {
                        var newZoom = zoomLevelAtCircleStart + zoomDirection;
                        if (newZoom >= 0 && newZoom <= MAX_ZOOM) {
                            self.map.setZoom(newZoom);
                        }
                    }
                    break;
                case "stop":
                    zoomLevelAtCircleStart = null;
                    break;
            }
        }
    }


    /**
	Function for panning the map
	**/
    function move(frame) {
        // if there is one hand grabbing...
        if (frame.hands.length > 0 && isGripped(frame.hands[LEFT_HAND])) {
            var leftHand = frame.hands[LEFT_HAND];
            var rightHand = frame.hands.length > 1 ? frame.hands[RIGHT_HAND] : undefined;

            // If there was no previous closed position, capture it and exit
            if (leftHandPrev == null) {
                leftHandPrev = leftHand;
                return;
            }

            // Calculate how much the hand moved
            var dX = leftHandPrev.stabilizedPalmPosition[X] - leftHand.stabilizedPalmPosition[X];
            var dY = leftHandPrev.stabilizedPalmPosition[Y] - leftHand.stabilizedPalmPosition[Y];
            //console.log("Movement: " + dX + ","+dY);

            var center = self.map.getCenter();

            var scaling = 4.0 / Math.pow(2, self.map.getZoom() - 1);

            var newLat = center.lat + dY * scaling;
            var newLng = center.lng + dX * scaling;

            var newCenter = L.latLng(newLat, newLng);

            self.map.panTo(newCenter)

            leftHandPrev = leftHand;

        } else {
            // If the left hand is not in a grab position, clear the last hand position
            if (frame.hands.length > LEFT_HAND && !isGripped(frame.hands[LEFT_HAND]) && leftHandPrev != null) {
                leftHandPrev = null;
            }
        }
    }

	
	///////////////////////////////////////////////////
	/////////////// Menu Controls  ////////////////////
	///////////////////////////////////////////////////
	
	NumMenuItems = $('#nav').find('a').length; 	// number of menu items
	menuItems = $('#nav').find('a');			// menu items
	prevMenuItem = null;						// previous selected menu items
	curMenuItem = 0;							// currently selected menu item
	var POI = null;
	var settingPOI = false;						// toggle POI setting modus
	menumode = false;							// check if menumode is active
	
	/**
	toggle menu by gesture
	**/
	function toggleMenu(frame) {
		if (frame.gestures != null && frame.gestures.length > 0) {
			for (var x = 0; x < frame.gestures.length; x++) {
				var gesture = frame.gestures[x];
				if (gesture.type == "swipe" && gesture.duration > 150000) { // duration maybe has to be adjusted
					var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
					if (isHorizontal) {
						$.fn.ferroMenu.toggleMenu("#nav");
						//console.log("works")
					}
				}
			}
		}
	} 
	

	var poi_tooltip = false; // check if poi tooltip is shown
	/**
	menu control with gestures
	**/
	function controlMenu(frame) {
		if (frame.hands.length > 0 && frame.hands[0].type == "right" && menumode == true) {
			var roll = frame.hands[0].roll()* 180/Math.PI; // hand rotation around leap z axis in degrees
			if (roll > 0 && roll < 90) {
				curMenuItem = 0; 
			} else if (0 > roll && roll > -90) {
				curMenuItem = 1;
			}
			
			if (prevMenuItem == null) {
				prevMenuItem = curMenuItem;
				return;
			}
		
			$(menuItems[prevMenuItem]).css({"opacity": "1", "box-shadow":"none"});
			$(menuItems[curMenuItem]).css({"opacity": "0.8", "box-shadow": "0px 0px 5px 3px #FFFFFF inset"}); // highlight currently selected menu item

			
			if (menuItems[curMenuItem].id == "poi" && poi_tooltip == false) {
				poi_tooltip = true;
				$('#lm').tooltip('show');
			} else if (menuItems[curMenuItem].id != "poi" && poi_tooltip == true) {
				poi_tooltip = false;
				$('#lm').tooltip('hide');
			}
			
			// if POI creation is selected by pinching
			if (menuItems[curMenuItem].id == "poi" && frame.hands[0].pinchStrength > 0.8) {
				//console.log(frame.hands[0].pinchStrength);
				$.fn.ferroMenu.toggleMenu("#nav"); // close menu -> map interaction is enabled
				POI = L.marker(newCenter);
				pois.addLayer(POI);
				settingPOI = true;
			} else if (menuItems[curMenuItem].id == "story" && frame.hands[0].pinchStrength > 0.9) {
				console.log(frame.hands[0]);
				$.fn.ferroMenu.toggleMenu("#nav");
				create_story();
			}
			prevMenuItem = curMenuItem;
		}
	}
	
	/**
	closes modal on swipe
	**/
	function closeModal(frame) {
		if (frame.hands.length > 0 && frame.hands[0].type == "right") {
			if (frame.gestures != null && frame.gestures.length > 0) {
				for (var x = 0; x < frame.gestures.length; x++) {
					var gesture = frame.gestures[x];
					if (gesture.type == "swipe" && gesture.duration > 150000) {
						var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
						if (isHorizontal && gesture.direction[0] < 0) { //swipe left
						console.log(gesture.type);
							if ($('#POImodal').hasClass('in')) {
								$('#POImodal').modal('hide');
								paused = false; // enable map controls
								stopFormRecording();
							}
							if ($('#story_modal').hasClass('in')) {
								$('#story_modal').modal('hide');
								paused = false; // enable map controls
								cancel_story();
							}
							if ($('#story_submit_modal').hasClass('in')) {
								$('#story_submit_modal').modal('hide');
								paused = false; // enable map controls
								cancel_story();
							}
							if ($('#story_elem_modal').hasClass('in')) {
								$('#story_elem_modal').modal('hide');
								paused = false; // enable map controls
								cancel_story();
							}
						}
					}
				}
			}
		}
	}
	

	///////////////////////////////////////////////////
    /////////// Utility Functions ////////////////////
	///////////////////////////////////////////////////
	
    /**
	Checks if a hand is gribbed
	**/
    function isGripped(hand) {
        return hand.grabStrength == 1.0;
    }

    /**
	Check orientation of a circle gesture
	**/
    function isClockwise(frame, gesture) {
        var clockwise = false;
        var pointableID = gesture.pointableIds[0];
        var direction = frame.pointable(pointableID).direction;
        var dotProduct = Leap.vec3.dot(direction, gesture.normal);
        if (dotProduct > 0) clockwise = true;
        return clockwise;
    }

    /**
	Change color of the handmarker depending on its state, gripped or not
	**/
    function getHandColor(hand) {
        if (isGripped(hand)) {
            return "rgb(0,119,0)";
        } else {
            var tint = Math.round((1.0 - hand.grabStrength) * 119);
            tint = "rgb(119," + tint + "," + tint + ")";
            return tint;
        }
    }

    window.LeapController = LeapController;

}(window));