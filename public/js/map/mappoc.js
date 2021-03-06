nokia.Settings.set("app_id", "vJ4GPRGkA6Y4gAooPKyX");
nokia.Settings.set("app_code", "cLUJSYAcqBDoP3OM1n-Kyw");
nokia.Settings.set("serviceMode", "cit");

var initMap = function(areaUpdatedCallback) {
    var map = initializeMap();
    initializeWithGPSLocation(map);
    var markers = initMarkers(map,areaUpdatedCallback);

//    initSearchRecommendations(map);

    window.search = function(a) {
        searchAddress(a,function(coords) {
            zoomTo(map,coords);
        });
    }

    return {
        map: map,
        search : search,
        recommend : recommend(map),
        reset: markers.resetMarkers
    }



}