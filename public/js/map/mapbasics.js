var initializeMap=function() {
    return new nokia.maps.map.Display(
       document.getElementById("mapContainer"), {
           baseMapType: nokia.maps.map.Display.SATELLITE,
           zoomLevel: 10,
           center: [52.51, 13.4],
           components: [
               new nokia.maps.map.component.Behavior(),
               new nokia.maps.map.component.ZoomBar(),
               new nokia.maps.map.component.ScaleBar(),

           ]
       }
   )
}

var STANDARD_ZOOM_VISIBLE_RADIUS = 100

var zoomTo = function(map,coords) {
     accuracyCircle = new nokia.maps.map.Circle(coords, STANDARD_ZOOM_VISIBLE_RADIUS);
     map.zoomTo(accuracyCircle.getBoundingBox(), false, "default");
}

var initializeWithGPSLocation = function(map) {
    if (nokia.maps.positioning.Manager) {
        var positioning = new nokia.maps.positioning.Manager();
        map.addListener("displayready", function () {
            positioning.getCurrentPosition(
                function (position) {
                    zoomTo(map,position.coords);
                },
                function (error) {
                    // no error handling, gps isn't that important
                }
            );
        });
    }
}
