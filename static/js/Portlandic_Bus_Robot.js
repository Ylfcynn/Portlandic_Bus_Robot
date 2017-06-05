"use strict";


jQuery(document).ready(function() {

  jQuery.ajax({                           // This is AJAX, a jQuery function.
          url: 'https://developer.trimet.org/ws/V1/stops',   // <-- Endpoint
          method: 'GET',                      // <-- HTTP method 'verb'
          data: {
                  'appID': 'CA8E1B6081BE37144D1BD33E7',
                  'll': '45.438328,-122.764737',
                  'meters': '100',
                  'json': 'true',
                },         // <-- Request parameters
          success: function(response){        // <-- 'Success handler'
              console.log('OK');
              parse(response);
          },
          error: function(errorMessage){             // <-- 'Error handler'
              console.log(errorMessage);
          }
      });

});

function initMap() {
  var uluru = {lat: 45.438328, lng: -122.764737};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}
