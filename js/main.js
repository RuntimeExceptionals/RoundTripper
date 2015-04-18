// main.js

$(document).ready(function() {
    initialize();
});

var placeSearch, autocomplete;
var route = {
	"places": [],
	"optimize": false,
}

function initialize() {
    // Initialize the map.
    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(44.5403, -78.5463),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);

    // Initialize address autocomplete
    autocomplete = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */(document.getElementById('autocomplete')),
      { types: ['geocode'] });
	  // When the user selects an address from the dropdown,
	  // populate the address fields in the form.
	  google.maps.event.addListener(autocomplete, 'place_changed', fillInAddress);

	//Add event listener to "Add Address" button
	$(document).on("click", "#add-address-btn", addAddressToRoute);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = new google.maps.LatLng(
          position.coords.latitude, position.coords.longitude);
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}


//Add address to the Route object and update 
function addAddressToRoute(){
	var place = autocomplete.getPlace();

	if(place === undefined) { //Could not find a place associated with provided address.
		//TODO replace this with something less terrible
		alert("Unable to locate provided address");
		return;
	}

	is_new_place = true;
	for(var i = 0; i < route["places"].length; i++){
		if (route.places[i].place_id == place.place_id) { 
			is_new_place = false; 
			break;
		}
	}

	if (is_new_place){
		route.places.push(place);
	}

	updateRoute();

}

function updateRoute(){
	route_container = $("#route-container");

    route_html = "";

    for(var i = 0; i < route["places"].length; i++){
    	place = '<div id = "' + route["places"][i].place_id + '" class="place">';
    	place += '<span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span>';
    	place += '<span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>';
    	place += '<span class="address">' + route["places"][i].adr_address + '</span>';
    	place += '</div>';
    	route_html += place;
    }

    route_container.html(route_html);

    updateMap();
}

function updateMap(){};