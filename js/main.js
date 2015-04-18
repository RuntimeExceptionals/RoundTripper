// main.js

$(document).ready(function() {
    initialize();
});

function initialize() {
    // Initialize the map.
    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(44.5403, -78.5463),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);
}
