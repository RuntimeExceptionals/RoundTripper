// main.js

$(document).ready(function() {
    initialize();
});

var map, placeSearch, autocomplete, directionsService, directionsDisplay;
var route = {
    "places": [],
    "optimize": false,
    "roundTrip": true,
}

function initialize() {
    // Initialize the map.
    var geolocation = new google.maps.LatLng(30.6014, -96.3144)

    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
        zoom: 8,
        center: geolocation,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(mapCanvas, mapOptions);

    // Initialize address autocomplete
    autocomplete = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */(document.getElementById('autocomplete')),
      { types: ['geocode'] });
	  // When the user selects an address from the dropdown,
	  // populate the address fields in the form.
	  google.maps.event.addListener(autocomplete, 'place_changed', fillInAddress);

    directionsService = new google.maps.DirectionsService();

    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

	//Add event listener to "Add Address" button
	$(document).on("click", "#add-address-btn", addAddressToRoute);
}

function recenterMap(position){
	console.log("this is happening")

	geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	map.panTo(geolocation);
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
      map.setCenter(geolocation);
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
        updateWeather(place.geometry.location.lat(), place.geometry.location.lng());
	}

	updateRoute();
}

function updateRoute(){
	route_container = $("#route-container");

    route_html = "";

    for(var i = 0; i < route["places"].length; i++){
        place =  '<div id = "place_' + route["places"][i].place_id + '" class="place">';
        place +=  '<div class="btn-group btn-group-xs" role="group" aria-label="...">';
        place +=    '<button type="button" class="btn btn-default" onclick="moveAddressUp(' + i + ')"">';
        place +=      '<span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span>';
        place +=    '</button>';
        place +=    '<button type="button" class="btn btn-default" onclick="moveAddressDown(' + i + ')"">';
        place +=      '<span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>'
        place +=    '</button>';
        place +=   '</div>'
    	place +=   '<span class="address">' + route["places"][i].adr_address + '</span>';	
    	place += '</div>';

    	route_html += place;
    }

    route_container.html(route_html);

    updateMap();
}

function updateMap(){
    origin = route.places[0].formatted_address;
    destination = route.places[route.places.length-1].formatted_address;
    if (route.roundTrip) { 
    	destination = route.places[0].formatted_address
    };

    waypoints = [];

    // Add waypoints to list without origin and destinations. 
    num_waypoints = route.places.length - 1
    if (route.roundTrip) {
    	num_waypoints += 1
    } 
    for(var i = 1; i < num_waypoints; i ++){
    	waypoints.push({location: route.places[i].formatted_address, stopover: true});
    }

    var request = {
    	origin: origin,
    	destination: destination,  
    	optimizeWaypoints: route.optimize,
    	waypoints: waypoints,
    	travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, function(response, status) {
    	directionsDisplay.setDirections(response);
    });
}

function moveAddressDown(loc){
    if (loc == route.places.length - 1) {
    	return; // already last.
    } 

	route.optimize = false;

	var temp = route.places[loc];
    route.places[loc] = route.places[loc + 1];
    route.places[loc + 1] = temp;

    updateRoute();
}

function moveAddressUp(loc){
    if (loc == 0) {
    	return; // already last.
    } 

	route.optimize = false;

	var temp = route.places[loc];
    route.places[loc] = route.places[loc - 1];
    route.places[loc - 1] = temp;

    updateRoute();
}







