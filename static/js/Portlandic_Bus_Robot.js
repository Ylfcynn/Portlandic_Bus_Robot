"use strict";


jQuery(document).ready(function() {

});

    function everyBreathYouTake() {
        navigator.geolocation.watchPosition(function(newLocation) {
          let latitude = newLocation.coords.latitude;
          let longitude = newLocation.coords.longitude;
          initMap(latitude, longitude);
          fetchBusStops(latitude, longitude);
      }, location_error, location_options);
  }

    function fetchBusStops(latitude, longitude) {
        //
        jQuery.ajax({                           // This is AJAX, a jQuery function.
                  url: 'https://developer.trimet.org/ws/V1/stops',   // <-- Endpoint
                  method: 'GET',                      // <-- HTTP method 'verb'
                  data: {
                          'appID': 'CA8E1B6081BE37144D1BD33E7',
                          'll': `${latitude},${longitude}`,
                          'meters': '100',
                          'json': 'true',
                        },         // <-- Request parameters
                  success: function(response){        // <-- 'Success handler'
                      console.log('OK');
                      console.log(response)
                      // parse(response);
                  },
                  error: function(error){             // <-- 'Error handler'
                      console.log(error);
                  }
          });
    }

    function getLocation() {
        navigator.geolocation.getCurrentPosition(function(userLocation) {
            let latitude = userLocation.coords.latitude;
            let longitude = userLocation.coords.longitude;
            initMap(latitude, longitude);
            fetchBusStops(latitude, longitude);
        });
    }

let location_options = {
    enableHighAccuracy: true,
    maximumAge        : 30000,
    timeout           : 27000
};

function location_error() {
  alert('Ack! No location data available!')
}

function initMap(latitude, longitude) {
  let pin = {lat: latitude, lng: longitude};
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: pin
  });
  let marker = new google.maps.Marker({
    position: pin,
    map: map
  });
  console.log('I know where you are...');
}

getLocation();
