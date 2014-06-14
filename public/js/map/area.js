
var displayArea = function(map,coords) {
    var polygon = new nokia.maps.map.Polygon(coords,
      {
          pen: { strokeColor: COLOR, lineWidth: 1 },
          brush: { color: COLOR }
      }
    )
    // Transparent green polygon with black border
    map.objects.add(polygon);

    var center = polygon.getBoundingBox().getCenter();

    map.objects.add(new TextMarker(
        /* We use  nokia.maps.geo.Coordinate.walk to generate
         * geoCoordinate for created StandardMarker;
         *
         * Coordinate.walk takes 3 arguments
         * 		- bearing: The bearing to use in the calculation in degrees
         * 		- distance: The distance to the destination in meters
         * 		- [overGreatCircle]: Optional argument
         * 				By default false.
         * 				If set true the computation uses the "Great Circle" algorithm otherwise "Rhumb Line".
         */
        center,
         areaInSquareMeters(coords).toFixed()+"sqm",
        70,35,
        {
        		brush: { color: "#00000000" }, // Transparent black background
        		pen: {
        			strokeColor: "#00000000", // White border outline
        			strokeWidth: 1
        		},
        		textPen: {
        			strokeColor: "#FFF",
        			fontSize: 12,
        			fontFamily: "sans-serif",
        			offsetX: 8,
        			offsetY: 17
        		}
        	}
    ));

}

var areaInSquareMeters = function(coords) {
    // very simple approximation
    if (coords.length != 5) {
//        alert("not a rectangle");
    }
    var a = coords[0],
        b = coords[1],
        c = coords[2];
    var xlength = a.distance(b);
    var ylength = b.distance(c);
    return xlength * ylength;
}