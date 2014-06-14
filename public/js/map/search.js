var searchAddress = function(searchTerm, callback) {
    var processResults = function (data, requestStatus, requestId) {
        var i, len, locations, marker;

        if (requestStatus == "OK") {
            // The function findPlaces() and reverseGeoCode() of  return results in slightly different formats
            locations = data.results ? data.results.items : [data.location];
            // We check that at least one location has been found
            if (locations.length > 0) {

                // Convert all found locations into a set of markers
                resultSet = new nokia.maps.map.Container();

                var coords = [];
                for (i = 0, len = locations.length; i < len; i++) {
                    marker = new nokia.maps.map.StandardMarker(locations[i].position, { text: i+1 });
                    resultSet.objects.add(marker);

                    coords.push(locations[i].position)
                }
                // Next we add the marker(s) to the map's object collection so they will be rendered onto the map


                callback(coords[0]);
            } else {
                alert("Your search produced no results!");
            }
        } else {
            alert("The search request failed");
        }
    };
    searchManager = nokia.places.search.manager.geoCode({
        searchTerm: searchTerm,
        onComplete: processResults
    });
}