var polyline;
var points;
var markers;
var map;
var eta;

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
    mapId: '43d5ecf9d4d9640d',
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

    input = document.getElementById("location-card")
    input.style.display="none"

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

            //computes ETA
            eta = computeETA(response);
            updateETA(eta);
        });
  }
  
  initAutocomplete(map);
  //something to do with rendering route?
  directionsRenderer.setMap(map);  
  //calls function below
  calculateAndDisplayRoute(directionsService, directionsRenderer);

  function addMarker(point, map) {

    if (!point || !point.LatLng){
      return;
    }

    // Create a div element
    const contentNode = document.createElement('div');

    var advancedMarker = new AdvancedMarkerElement({
      position: { lat: point.LatLng.lat(), lng: point.LatLng.lng() },
      title: point.LatLng.lat() + ", " + point.LatLng.lng(),
      content: contentNode, // Use the created div element as content
      map: map,
    });

    // Set its HTML content
    if(point.iconName !== "Gw"){
      contentNode.innerHTML = `<img src="markerAssets/${point.iconName}.png" alt="${point.iconName}" width="50" height="50">`;
      google.maps.event.addListener(advancedMarker, 'click', function() {
        displayInfo(point);
      });
    }
    else{
      contentNode.innerHTML = `<img src="markerAssets/${point.iconName}.png" alt="${point.iconName}" width="20" height="20">`;
    }

    markers.push(advancedMarker); 
  }

  function addAllMarkers(points){
    markers = [];
    points.forEach(point =>{
      if(point.iconName == undefined){
        return
      }
      addMarker(point, map)
    })
  }
  
  var distanceCounter = 0
  async function computeTotalDistance(result) {
        var totalDist = 0;
        var myroute = result.routes[0];
        for (i = 0; i < myroute.legs.length; i++) {
          totalDist += myroute.legs[i].distance.value;   
        }
  //total distance is in meters
        await addPoints(result, totalDist)
        addAllMarkers(points)
        const contentNode = document.createElement('div')
        contentNode.innerHTML = `<img src="arrow.png" width="25" height="25">`;
        const path = polyline.getPath();
        const firstPoint = path.getAt(0);
        const car = new AdvancedMarkerElement({
          position: { lat: firstPoint.lat(), lng: firstPoint.lng() },
          title: "car",
          content: contentNode, // Use the created div element as content
          map: map,
        });
        setInterval(moveCar, 5000, car) //moves car at a fixed rate
        setInterval(updatePoints, 1800000, result) //updates weather data of points
        setInterval(resetCar, 900000, car) //resets car to where it actually is
  }
  
  //gets total duration along polyline
  async function computeETA(result) {
    var totalDur = 0;
    var myroute = result.routes[0];
    for (i = 0; i < myroute.legs.length; i++) {
      totalDur += myroute.legs[i].duration.value;   
    }
    return totalDur;
  }
  
  async function addPoints(result, totalDist) {
    var interval = 24140.1; //meters in 15 miles
    var distanceDone = 0;
    while(distanceDone<=totalDist){
      var point = new Object();
      point.LatLng = polyline.GetPointAtDistance(distanceDone);
      time = findTimeAlongPolyline(result, point.LatLng);
      point.timeTo = time; //in seconds
      await weatherFunction(point, time);
      if(point.iconName !== undefined){
        points.push(point);
      }
      distanceDone+=interval;
    }
  }

  function updatePoints(response){
    currentLoc = getCurrentLoc()
    time = findTimeAlongPolyline(response, currentLoc)
    eta -= time
    updateETA(eta)
    for(var i=points.length-1; i>=0; i--){
      let point = points[i]
      point.timeTo -= time
      if(point.timeTo>=0){
        weatherFunction(point, point.timeTo)
      }
      else if(i+2 <= points.length){
        points = points.slice(0,i).concat(points.slice(i+1))
      }
      else{
        points = points.slice(0, i)
      }
    }
    markers = []
    addAllMarkers(points)
  }

  function moveCar(marker){
    let position = polyline.GetPointAtDistance(distanceCounter)
    marker.position = {lat: position.lat(), lng: position.lng()}
    distanceCounter += 134.112 //meters travelled by a car moving 60mph in 5 seconds
  }

  function resetCar(marker){
    let position = getCurrentLoc()
    marker.position = {lat: position.lat(), lng: position.lng()}
    distanceCounter = polyline.getDistanceAtPoint(position)
  }

}

//takes in seconds left in route and converts to ETA
function updateETA(secLeft) {
  currDate = new Date()
  currTime = currDate.getTime(); //seconds since epoch at current time
  eta = currTime + secLeft*1000; //seconds since epoch at eta (converts from milliseconds -> seconds)
  currTime = new Date(currTime); //converts to date format
  eta = new Date(eta); //converts to date format
  if (currTime.getDate() == eta.getDate()) { //if current time and eta are same day
    displayETA = eta.getHours() + ":" + eta.getMinutes();
  } else { //if on separate days, include date
    displayETA = eta.getMonth() + "/" + eta.getDate() + "  " + eta.getHours() + ":" + eta.getMinutes();
  }
  /*console.log(eta.substring(0,eta.indexOf("GMT")));*/
  box = document.querySelector("#eta");
  box.innerText = "ETA: " + displayETA;
}

function displayWeather() {
  box = document.querySelector("#weather");
  box.innerText = "[WEATHER DETAILS]";
}

function displayDirections() {
  box = document.querySelector("#directions");
  box.innerText = "[NEXT DIRECTION]";
}

window.initMap = initMap;
