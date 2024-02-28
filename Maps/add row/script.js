function addPoint() {
  var wayPtsDiv = document.getElementById("way_points");
  var newInput = document.createElement("input");
  newInput.type = "text";
  newInput.className = "search_bar point waypt";
  newInput.placeholder = "Enter Stop Point";
  wayPtsDiv.appendChild(newInput);
}

function removePoint() {
  //var wayPtsDiv = document.getElementById("way_points");
  var wayPtsFields = document.querySelectorAll(".waypt");
  var del = prompt("Enter a stop point to delete\n0 = first point, 1 = second, etc.\ncan't be starting locaiton or destination");
  wayPtsFields[del].remove();
}

function initMap() {

  //for displaying route
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  //initializes map
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 37.682819, lng: -77.587799 },
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false

  });
  
  //something to do with rendering route?
  directionsRenderer.setMap(map);
  
  //calls function below
  calculateAndDisplayRoute(directionsService, directionsRenderer);
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
          directionsRenderer.setDirections(response); //renders route
        } else {
          alert("failed to display route"); //fail message
        }
      });
}



window.initMap = initMap;
