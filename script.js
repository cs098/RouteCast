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
  
  //destinations on route
  var start = "Richmond, VA";
  var end = "New York, New York";
  var waypts = []; //holds object for each stop
  //add a loop later to push every stop we need (see if latitudes and longitudes work?)***
  waypts.push({
    location: "Maryland, DE",
    stopover: true
  });

  //calculates route
  directionsService
    .route({
      origin: start,
      destination: end,
      waypoints: waypts,
      optimizeWaypoints: true, //optimizes order of points for fastest route, idk if we need this
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
