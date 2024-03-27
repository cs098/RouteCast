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