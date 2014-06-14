nokia.Settings.set("app_id", "vJ4GPRGkA6Y4gAooPKyX");
nokia.Settings.set("app_code", "cLUJSYAcqBDoP3OM1n-Kyw");

window.onload = function() {
    var map = new nokia.maps.map.Display(
        document.getElementById("mapContainer"), {
            baseMapType: nokia.maps.map.Display.SATELLITE,
            // Zoom level for the map
            zoomLevel: 10,
            // Map center coordinates
            center: [52.51, 13.4],
            components: [
                // We add the behavior component to allow panning / zooming of the map
                new nokia.maps.map.component.Behavior()
            ]
        }
    );

    /* The positioning manager is only available if the browser used supports
     * W3C geolocation API
     */
    if (nokia.maps.positioning.Manager) {
    	var positioning = new nokia.maps.positioning.Manager();
    	// Trigger the load of data, after the map emmits the "displayready" event
    	map.addListener("displayready", function () {
    		// Gets the current position, if available the first given callback function is executed else the second
    		positioning.getCurrentPosition(
    			// If a position is provided by W3C geolocation API of the browser
    			function (position) {
    				var coords = position.coords, // we retrieve the longitude/latitude from position
    					marker = new nokia.maps.map.StandardMarker(coords), // creates a marker
    					/* Create a circle map object  on the  geographical coordinates of
    					 * provided position with a radius in meters of the accuracy of the position
    					 */
    					accuracyCircle = new nokia.maps.map.Circle(coords, coords.accuracy);

    				// Add the circle and marker to the map's object collection so they will be rendered onto the map.
    				map.objects.addAll([accuracyCircle, marker]);
    				/* This method zooms the map to ensure that the bounding box calculated from the size of the circle
    				 * shape is visible in its entirety in map's viewport.
    				 */
    				map.zoomTo(accuracyCircle.getBoundingBox(), false, "default");
    			},
    			// Something went wrong we wee unable to retrieve the GPS location
    			function (error) {
    				var errorMsg = "Location could not be determined: ";

    				// We determine what caused the error and generate error message
    				if (error.code == 1) errorMsg += "PERMISSION_DENIED";
    				else if (error.code == 2) errorMsg += "POSITION_UNAVAILABLE";
    				else if (error.code == 3) errorMsg += "TIMEOUT";
    				else errorMsg += "UNKNOWN_ERROR";

    					// Throw an alert with error message
    					alert(errorMsg);
    			}
    		);
    	});
    }
}