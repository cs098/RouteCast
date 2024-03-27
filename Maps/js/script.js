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
  
  initAutocomplete(map);
  //something to do with rendering route?
  directionsRenderer.setMap(map);  
  //calls function below
  calculateAndDisplayRoute(directionsService, directionsRenderer);

  //marker example code - just for presentation / testing
  addMarker(map, 37.792919,-77.487799,"C:\\Classes\\Weather Tracker App\\current version\\markerAssets\\!BfWsLv!Dw.png")
  addMarker(map, 37.392919,-77.787799,"C:\\Classes\\Weather Tracker App\\current version\\markerAssets\\Bf!Ws!LvDw.png")
  addMarker(map, 37.592919,-77.197799,"C:\\Classes\\Weather Tracker App\\current version\\markerAssets\\!Bf!WsLvDw.png")

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

window.initMap = initMap;
console.log(findTimeAlongPolyline(response, getCurrentLoc()));
