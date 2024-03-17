var polyline;
var points;
var map;

function initMap() {

  initEpolys();

  //for displaying route
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  polyline = new google.maps.Polyline({
    path: [],
    strokeColor: '#FF0000',
    strokeWeight: 3
      });
  points = [];

  //initializes map
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 37.682819, lng: -77.587799 },
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false

  });
  
  initAutocomplete(map);
  //something to do with rendering route?
  directionsRenderer.setMap(map);
  
  //calls function below
  calculateAndDisplayRoute(directionsService, directionsRenderer);
}

//initializing autocomplete inputs
function initAutocomplete(map) { //is parameter necessary? (see commented out line)
  
  //used in creating autocomplete
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
  };

  //stores autocompletes in list
  autocompletes = [];
  var inputs = document.getElementsByClassName("point");
  for (i = 0; i < inputs.length; i++) {
    autocompletes.push(new google.maps.places.Autocomplete(inputs[i], options));
  }
  //autocomplete.bindTo("bounds", map);

}

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

          addPoints(response);
        } else {
          alert("failed to display route"); //fail message
        }
      });
}

//when user adds point to route
function addSearchBar() {
  //gets large div where smaller div will go
  var locationCard = document.getElementById("inputs");
  //creates class for label and search bar to go in
  var newDiv = document.createElement("div");
  newDiv.className = "location-input";
  //creates label
  var newLabel = document.createElement("label");
  newLabel.innerText = "Point " + (document.getElementsByClassName("pointLabel").length+1) + ":";
  newLabel.className="pointLabel";
  //creates search bar
  var newSearchBar = document.createElement("input");
  newSearchBar.type = "text";
  newSearchBar.className = "search_bar point stoppt";
  newSearchBar.placeholder = "Enter Location";
  //creates delete button
  var newDel = document.createElement("img");
  newDel.className = "delete";
  newDel.setAttribute("onclick", "removeSearchBar(this)");
  newDel.setAttribute("src", "Maps/icons8-delete-30.png");
  //appending elements to divs
  newDiv.appendChild(newLabel);
  newDiv.appendChild(newSearchBar);
  newDiv.appendChild(newDel);
  locationCard.appendChild(newDiv);
  initAutocomplete();
}

function removeSearchBar(thisButton) {
  var labels = document.getElementsByClassName("pointLabel"); //gets list of labels
  if (labels.length < 3) { //ensures at least 2 points
    alert("Need at least 2 points.");
    return;
  }
  thisButton.parentElement.remove();
  for (i = 0; i < labels.length; i++) {
    labels[i].innerHTML = "Point " + (i+1) + ":";
  }
}

  function computeTotalDistance(result) {
  totalDist = 0;
  var myroute = result.routes[0];
  for (i = 0; i < myroute.legs.length; i++) {
    totalDist += myroute.legs[i].distance.value; 
  }
  return totalDist;
  }

    function addPoints(response) {
      var totalDist = computeTotalDistance(response);
      const interval = 16093.4; //the amount of meters in 10 miles
      var distanceDone = 0;
      while(distanceDone<totalDist){
        var point = new Object;
        point.point = polyline.GetPointAtDistance(distanceDone)
        point.distance = distanceDone;
        point.timeToLocation = findTimeAlongPolyline(response, point.point);
        points.push(point);
        distanceDone+=interval;
      }
    }

//gets current location
function getCurrentLoc() {
  //simplified version
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
    });
  } else {
    alert("Browser does not support geolocation.");
  }
}

window.initMap = initMap;
