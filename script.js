function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 37.682819, lng: -77.587799 },
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false

  });

}

window.initMap = initMap;


