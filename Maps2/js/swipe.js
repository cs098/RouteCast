function addWindowListener(){

var windowElement = document.getElementById("weatherWindow");

var touchStartY = 0;
var touchEndY = 0;

// Add touch start event listener
windowElement.addEventListener("touchstart", function(event) {
    touchStartY = event.touches[0].clientY;
});

// Add touch end event listener
windowElement.addEventListener("touchend", function(event) {
    touchEndY = event.changedTouches[0].clientY;
    
    // Calculate swipe distance
    var swipeDistance = touchEndY - touchStartY;
    
    // Check if the event was triggered by a touch input
    if (event.cancelable && swipeDistance < -100) {
        // Swipe up detected, close the window
        windowElement.style.display = "none";
    }
});
}
