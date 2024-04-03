//initializing autocomplete inputs
function initAutocomplete(map) {
  
    //used in creating autocomplete
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
    };
  
    //stores autocompletes in list
    autocompletes = [];
    var inputs = document.getElementsByClassName("point");
    for (i = 0; i < inputs.length; i++) {
      autocompletes.push(new google.maps.places.Autocomplete(inputs[i], options));
    }
  
}

//when user adds point to route
function addSearchBar() {
    //gets large div where smaller div will go
    var locationCard = document.getElementById("inputs");
    //creates class for label and search bar to go in
    var newDiv = document.createElement("div");
    newDiv.className = "location-input";
    //creates label
    var newLabel = document.createElement("label");
    newLabel.innerText = "Point " + (document.getElementsByClassName("pointLabel").length+1) + ":";
    newLabel.className="pointLabel";
    //creates search bar
    var newSearchBar = document.createElement("input");
    newSearchBar.type = "text";
    newSearchBar.className = "search_bar point";
    newSearchBar.placeholder = "Enter Location";
    //creates delete button
    var newDel = document.createElement("img");
    newDel.className = "delete delMove"; //delMove fixes pos of new trashcans
    newDel.setAttribute("onclick", "removeSearchBar(this)");
    newDel.setAttribute("src", "C:\\Classes\\Weather Tracker App\\current version\\icons8-delete-30.png"); //add backslashes
    //appending elements to divs
    newDiv.appendChild(newLabel);
    newDiv.appendChild(newSearchBar);
    newDiv.appendChild(newDel);
    locationCard.appendChild(newDiv);
    initAutocomplete();
  }
  
  function removeSearchBar(thisButton) {
    var labels = document.getElementsByClassName("pointLabel"); //gets list of labels
    if (labels.length < 3) { //ensures at least 2 points
      alert("Need at least 2 points.");
      return;
    }
    thisButton.parentElement.remove();
    for (i = 0; i < labels.length; i++) {
      labels[i].innerHTML = "Point " + (i+1) + ":";
    }
  }