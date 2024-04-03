function initCalculateAndDisplayRoute(){
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    var wayptsHTML = document.querySelectorAll(".point"); //holds input element for each stop
    var waypts = []; //holds location info for each stop

    //iterates through all waypoints (inbetween points)
    for (var i = 0; i < wayptsHTML.length; i++) {
        if (wayptsHTML.item(i).value != "") { //ensures input isn't blank
        waypts.push({
            location: wayptsHTML.item(i).value,
            stopover: false
        });
        }
    }

    //checks if at least 2 points (origin and destination) have been entered
    if (waypts.length < 2) {
        return; //ends function if less than 2 points
    }

    //calculates route
    directionsService
        .route({
        origin: waypts[0].location,
        destination: waypts[waypts.length-1].location,
        waypoints: waypts,
        optimizeWaypoints: false, //optimizes order of points for fastest route, idk if we need this
        travelMode: google.maps.TravelMode.DRIVING, //mode can be changed if needed
        },
        //checks if locations are valid 
        function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                polyline.setPath([]);
            var bounds = new google.maps.LatLngBounds();
            startLocation = new Object();
            endLocation = new Object();
            directionsRenderer.setDirections(response); //renders route
            var legs = response.routes[0].legs;
            startLocation.latlng = legs[0].start_location;
            startLocation.address = legs[0].start_address;
            endLocation.latlng = legs[legs.length-1].end_location;
            endLocation.address = legs[legs.length-1].end_address;
            for (i=0;i<legs.length;i++) {
                var steps = legs[i].steps;
                for (j=0;j<steps.length;j++) {
                var nextSegment = steps[j].path;
                for (k=0;k<nextSegment.length;k++) {
                    polyline.getPath().push(nextSegment[k]);
                    bounds.extend(nextSegment[k]);
                }
                }
            }

            polyline.setMap(map);

            computeTotalDistance(response);
            } else {
            alert("failed to display route"); //fail message
            }
        });
}
}