var polyline;
var points;
var map;

function initMap() {

  initEpolys();

  //for displaying route
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  //const { AdvancedMarkerElement } = google.maps.importLibrary("marker");

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

  directionsRenderer.setMap(map);
  directionsRenderer.setPanel(document.getElementById("sidebar"));

  const control = document.getElementById("floating-panel");

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  const onChangeHandler = function () {
  };

  document.getElementById("Start").addEventListener("change", onChangeHandler);
  document.getElementById("Final").addEventListener("change", onChangeHandler);
  
  initAutocomplete(map);
  //something to do with rendering route?
  directionsRenderer.setMap(map);  
  //calls function below
  calculateAndDisplayRoute(directionsService, directionsRenderer);

  //marker example code - just for presentation / testing
  addMarker(map, 37.792919,-77.487799,"markerAssets/!BfWsLv!Dw.png")
  addMarker(map, 37.392919,-77.787799,"markerAssets/Bf!Ws!LvDw.png")
  addMarker(map, 37.592919,-77.197799,"markerAssets/!Bf!WsLvDw.png")

}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const start = document.getElementById("Start").value;
  const end = document.getElementById("Final").value;
  const selectedMode = Driving;

  directionsService
    .route({
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode[selectedMode],
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) =>
      window.alert("Directions request failed due to " + status)
    );
}

function addMarker(map, lat, lng, img) {
  icon = {
    url: img,
    scaledSize: new google.maps.Size(50,50),
  }

  new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map,
    icon: icon,
  });
  
}


var totalDist;
function computeTotalDistance(result) {
      totalDist = 0;
      var myroute = result.routes[0];
      for (i = 0; i < myroute.legs.length; i++) {
        totalDist += myroute.legs[i].distance.value;   
      }
//total distance is in meters
      addPoints()
}

function addPoints() {
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

window.initMap = initMap;
