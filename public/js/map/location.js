var stateForCoordinates = function(coords,callback) {
    var searchManager = nokia.places.search.manager;
    var coord = coords[0];
    searchManager.reverseGeoCode({
    		latitude: coord.latitude,
    		longitude: coord.longitude,
    		onComplete: function(data, requestStatus, requestId) {

    		    callback(data.location.address.state)
    		}
    	});

}