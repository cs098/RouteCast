function getCurrentLoc() {

  //simplified version
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        return new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    });
  } else {
    alert("Browser does not support geolocation.");
  }
}

function findTimeAlongPolyline(response, point) {
  var legs = response.routes[0].legs;
  var totalTime = 0;
  var closestPoint;

  for (var i = 0; i < legs.length; i++) {
      var steps = legs[i].steps;
      for (var j = 0; j < steps.length; j++) {
          var step = steps[j];
          var start = step.start_location;
          var end = step.end_location;
          var stepDistance = step.distance.value;
          var stepDuration; // duration in seconds

          var stepPolyline = extractPolylineSegment(polyline, start, end);

          // Check if the point lies on the current step
          closestPoint = google.maps.geometry.poly.isLocationOnEdge(point, stepPolyline, 0.00001);
          if (closestPoint) {
            var distanceToClosestPoint = google.maps.geometry.spherical.computeDistanceBetween(start, point);
            // Calculate the time to the closest point along the current step
            stepDuration = (distanceToClosestPoint / stepDistance) * step.duration.value;
            totalTime += stepDuration;
            break;
          }
          else{
            stepDuration = step.duration.value;
            totalTime += stepDuration;
          }  
      }
  }

  // If the point is not on the polyline, return an error message
  if (!closestPoint) return "Point not on polyline";
  return totalTime;
}

function extractPolylineSegment(polyline, startPoint, endPoint) {
  var segment = new google.maps.Polyline({
    path: []
  });  
  var isSegmentStarted = false;
  
  // Iterate over each point in the original polyline
  for (var i = 0; i < polyline.getPath().getLength(); i++) {
      var point = polyline.getPath().getAt(i);

      // Check if the current point is the start point of the segment
      if (Math.abs(point.lat()-startPoint.lat())<0.00001 && Math.abs(point.lng()-startPoint.lng())<0.00001) {
          isSegmentStarted = true;
      }

      // If the segment has started, add the point to the segment polyline
      if (isSegmentStarted) {
          segment.getPath().push(point);
      }

      // Check if the current point is the end point of the segment
      if (Math.abs(point.lat()-endPoint.lat())<0.00001 && Math.abs(point.lng()-endPoint.lng())<0.00001) {
          break; // Exit loop when end point is reached
      }
  }

  return segment;
}
