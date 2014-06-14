
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
