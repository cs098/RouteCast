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
  while(distanceDone<totalDist){
    points.push(polyline.GetPointAtDistance(distanceDone));
    distanceDone+=interval;
  }
}

function getCurrentLoc() {

  //simplified version
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
        return new google.maps.LatLng(position.coords.latitude,position.coords.longitude)
        //console.log(position.coords.latitude);
        //console.log(position.coords.longitude);
    });
  } else {
    alert("Browser does not support geolocation.");
  }
}

function findTimeAlongPolyline(response, point) {
  console.log("point: " +point.lat() + "," + point.lng());
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