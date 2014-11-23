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

            // handmarkers
            markHands(frame)

            move(frame);

            if (self._isZooming) {
                return; // Skip this update
            }

            //Check for a hand
            if (frame.hands != null && frame.hands.length > 0) {
                //Check for gestures - zoom in / out
                if (frame.gestures != null && frame.gestures.length > 0) {
                    for (var x = 0; x < frame.gestures.length; x++) {
                        var gesture = frame.gestures[x];
                        if (gesture.type == "circle") {
                            zoom(frame, gesture);
                        }
                    }
                }
            }

        });
    }



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

                var handMarker = handMarkers[i];
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




    /////////// Utility Functions ////////////////////

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