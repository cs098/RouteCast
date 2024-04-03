var polyline;
var points;
var markers;
var map;

async function initMap() {

  initEpolys();
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  //for displaying route
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  polyline = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 3
      });
  points = [];
  markers = [];

  //initializes map
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 37.682819, lng: -77.587799 },

    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false

  });

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
  
  initAutocomplete(map);
  //something to do with rendering route?
  directionsRenderer.setMap(map);  
  //calls function below
  calculateAndDisplayRoute(directionsService, directionsRenderer);

  function addMarker(map, point) {

    if (!point || !point.LatLng){
      return;
    }

    // Create a div element
    const contentNode = document.createElement('div');
    // Set its HTML content
    contentNode.innerHTML = `<img src="markerAssets/${point.iconName}.png" alt="${point.iconName}" width="50" height="50">`;

    var advancedMarker = new AdvancedMarkerElement({
      position: { lat: point.LatLng.lat(), lng: point.LatLng.lng() },
      title: point.LatLng.lat() + ", " + point.LatLng.lng(),
      content: contentNode, // Use the created div element as content
      //gmpClickable: true,
      //"gmp-click": displayInfo(point),
      map: map,
    });

    markers.push(advancedMarker);    
  }
  
  function displayInfo(point){
    box = document.createElement('div');
  
    for(let i=0;i<point.dates.length;i++){
  
    }
  }
  
  var totalDist;
  function computeTotalDistance(result) {
        totalDist = 0;
        var myroute = result.routes[0];
        for (i = 0; i < myroute.legs.length; i++) {
          totalDist += myroute.legs[i].distance.value;   
        }
  //total distance is in meters
        pointA = new Object();
        pointA.LatLng = new google.maps.LatLng(37.5407, -77.4360);
        pointA.iconName = "BsBfLv";
        addMarker(map, pointA);
        addPoints(result)
  }
  
  function addPoints(result) {
    var interval = 16093.4; //the amount of meters in 10 miles
    var distanceDone = 0;
    while(distanceDone<=totalDist){
      point = new Object();
      point.LatLng = polyline.GetPointAtDistance(distanceDone);
      time = findTimeAlongPolyline(result, point.LatLng);
      point.timeTo = time; //in seconds
      weatherFunction(point, time);
      points.push(point);
      distanceDone+=interval;
    }
  }

}

window.initMap = initMap;