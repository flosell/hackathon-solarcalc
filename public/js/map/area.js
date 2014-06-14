
var displayArea = function(map,coords) {
    var polygon = new nokia.maps.map.Polygon(coords,
      {
          pen: { strokeColor: "#000", lineWidth: 1 },
          brush: { color: "#2C2A" }
      }
    )
    // Transparent green polygon with black border
    map.objects.add(polygon);
}

var areaInSquareMeters = function(coords) {
    // very simple approximation
    if (coords.length != 5) {
        alert("not a rectangle");
    }
    var a = coords[0],
        b = coords[1],
        c = coords[2];
    var xlength = a.distance(b);
    var ylength = b.distance(c);
    return xlength * ylength;
}