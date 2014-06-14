/* We create a new helper object MarkerPolyline which
 * create polylines with standard Markers on every
 * point in its path
 */
var MarkerPolyline = function (coords, props) {
    // Call the "super" constructor to initialize properties inherited from Container
    nokia.maps.map.Container.call(this);

    // Calling MarkerPolyline constructor
    this.init(coords, props);
};

extend(MarkerPolyline, nokia.maps.map.Container);


// MarkerPolyline constructor function
MarkerPolyline.prototype.init = function (coords, props) {
    var i,
        coord,
        marker,
        lineProps = props.polyline || {},
        markerProps = (this.markerProps = props.marker || {});
    this.orderedCoords = [];
    this.coords = {};

    // Create a polyline
    this.polyline = new nokia.maps.map.Polyline(coords, lineProps);

    // Add the polyline to the container
    this.objects.add(this.polyline);

    /* We loop through the point to create markers
     * for each of the points and we store them
     */
    for (i = 0; coord = coords[i]; i++) {
        marker = new nokia.maps.map.StandardMarker(coord, markerProps);
        this.coords[coord.latitude + "_" + coord.longitude] = { idx: i + 1, marker: marker };
        this.objects.add(marker);
        this.orderedCoords.push(coord);
    }
};

// The add function allows you to add a new point to a MarkerPolyline
MarkerPolyline.prototype.add = function (coord) {
    // Create a new standard marker
    var markerProps = this.markerProps,
        marker,
        key = coord.latitude + "_" + coord.longitude;

    if (!this.coords[key]) {
        marker = new nokia.maps.map.StandardMarker(coord, markerProps);
        this.coords[key] = { idx: this.objects.getLength(), marker: marker };

        /* Add the marker to the object's collections
         * so the marker will be rendered onto the map
         */
        this.objects.add(marker);

        /* We can extend a nokia.maps.map.Polyline by adding
         * geo coordinates to its internal nokia.maps.map.Shape
         * accessable via the path property
         */
        this.polyline.path.add(coord);
        this.orderedCoords.push(coord);
    }
};

// The remove function allows you to remove a point from MarkerPolyline
MarkerPolyline.prototype.remove = function (coord) {
    /* Polyline internaly stores the geo coordinates that make up
     * its shape as a nokia.maps.util.Strip.
     *
     * Strip stores coordinates in the following format
     * [latitude, longitude, altitude, ..., latitude, longitude, altitude]
     */
    var coords = this.polyline.path.internalArray,
        i = this.polyline.path.getLength(),
        marker,
        key = coord.latitude + "_" + coord.longitude,
        idx;

    if (!this.coords[key])
        return;

    /* To remove from a Strip you need to know the index
     * of the coordinate to remove e.g. its latitude
     * hence we loop over the internalArray as described above
     */
    while (i--) {
        if (coords[i * 3 ] === coord.latitude && coords[i * 3 + 1] === coord.longitude) {
            idx = i;
        }
    }

    // Index of coordinate found, now we remove coordinate from polyline
    this.polyline.path.remove(idx);

    // Remove the marker
    marker  = this.coords[key].marker;
    this.objects.remove(marker);
    marker.destroy();

    delete this.coords[key];
    // TODO: remove from ordered coords
};

MarkerPolyline.prototype.reachedFirstMarkerAgain = function(currentCoord) {
    var distance = this.orderedCoords[0].distance(currentCoord)
    return distance < 2;
}

var initMarkers = function(map,areaUpdatedCallback) {
    var markerPolyline = null;
    var polylineInitialized = function() {
        return markerPolyline!=null;
    };

    var initializePolyline = function(map,coord) {
        var coords = [coord];
        markerPolyline = new MarkerPolyline(
            coords,
            {
                polyline: { pen: { strokeColor: COLOR, lineWidth: 4 } },
                marker: { brush: { color: COLOR } }
            }
        );

        map.objects.add(markerPolyline);
    };

    var TOUCH = nokia.maps.dom.Page.browser.touch,
    	CLICK = TOUCH ? "tap" : "click",
    	addedCoords = [];

    map.addListener(CLICK, function (evt) {
    	var coord = map.pixelToGeo(evt.displayX, evt.displayY);
        if (!polylineInitialized()) {
            initializePolyline(map,coord);
        }else {
            if (markerPolyline.reachedFirstMarkerAgain(coord)) {
                var coords = markerPolyline.orderedCoords;
                displayArea(map,coords);
                stateForCoordinates(coords,function(state){
                    areaUpdatedCallback({
                        selectedArea:areaInSquareMeters(coords),
                        selectedState: state,
                    });
                });
            }else {
                markerPolyline.add(coord);
                addedCoords.push(coord);
            }
    	}
    });

    window.resetMarkers = function() {
        var i = addedCoords.length;

        	while (i--) {
        		markerPolyline.remove(addedCoords[i]);
        	}

        addedCoords = [];

        markerPolyline = null;
        map.objects.clear();
    }
}