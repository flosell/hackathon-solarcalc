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
                // no results for the given address, we don't do anything
            }
        } else {
            // no error handling at this time...
        }
    };
    searchManager = nokia.places.search.manager.geoCode({
        searchTerm: searchTerm,
        onComplete: processResults
    });
}

var initSearchRecommendations = function(map) {
    var customSearchBox = new nokia.places.widgets.SearchBox({
        targetNode: "addrSearch",
//        template: "customSearchBox",
        searchCenter: function () {
            return {
                latitude: 52.516274,
                longitude: 13.377678
            };
        },
        onResults: function (data) {
            // The argument data, which is an instance of nokia.places.objectsSearchResponseView
            // contains the search results

        }
    });
}

nokia.places.settings.setLocale("en") // force to english so that lookup by state works

var recommend = function(map) {
    return function(searchTerm, callback) {
        var processResults = function (data, requestStatus, requestId) {
            var titles = data.results.items.map(function(item) {
                return item.title;
            });
            // deactivated because useless!
//            callback(titles);
        }

        // http://stackoverflow.com/questions/9571953/nokia-ovi-map-autocomplete-feature
        searchManager = nokia.places.search.manager.findPlaces({
            searchTerm: searchTerm + ", germany",
            onComplete: processResults,
            searchCenter: map.center,
            limit: 10
        });
    }
}