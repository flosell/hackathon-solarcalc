nokia.Settings.set("app_id", "vJ4GPRGkA6Y4gAooPKyX");
nokia.Settings.set("app_code", "cLUJSYAcqBDoP3OM1n-Kyw");

window.onload = function() {
    var map = new nokia.maps.map.Display(
        document.getElementById("mapContainer"), {
            // Zoom level for the map
            zoomLevel: 10,
            // Map center coordinates
            center: [52.51, 13.4]
        }
    );
}