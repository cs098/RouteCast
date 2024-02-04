function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 37.682819, lng: -77.587799 },
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false

  });

  //route between two points (change to accomodate more than two points later)
  var pointA = new google.maps.LatLng(37.682819, -77.587799); //lat and lng will be user inputted
  var pointB = new google.maps.LatLng(37.682819, -76.587799);
  const directionsService = new google.maps.DirectionsService;
  const directionsDisplay = new google.maps.DirectionsRenderer({map: map});
  
  //calculates and displays route
  directionsService.route({
    origin: pointA,
    destination: pointB,
    travelMode: google.maps.TravelMode.DRIVING //set to driving mode for now (can be changed later if needed)
  },
    function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        alert("failed to display");
      }
  });

}

window.initMap = initMap;


