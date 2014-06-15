
var displayArea = function(map,coords) {
    var polygon = new nokia.maps.map.Polygon(coords,
      {
          pen: { strokeColor: COLOR, lineWidth: 1 },
          brush: { color: COLOR }
      }
    )
    map.objects.add(polygon);

    var center = polygon.getBoundingBox().getCenter();

    map.objects.add(new TextMarker(
        center,
         areaInSquareMeters(coords).toFixed()+"sqm",
        70,35,
        {
        		brush: { color: "#00000000" }, // transparent background
        		pen: {
        			strokeColor: "#00000000", // transparent outline
        			strokeWidth: 1
        		},
        		textPen: {
        			strokeColor: "#FFF",
        			fontSize: 13,
        			fontFamily: "sans-serif",
        			offsetX: 8,
        			offsetY: 17
        		}
        	}
    ));

}

var areaInSquareMeters = function(coords) {
    var a = coords[0],
        b = coords[1],
        c = coords[2];
    var xlength = a.distance(b);
    var ylength = b.distance(c);
    return xlength * ylength;
}