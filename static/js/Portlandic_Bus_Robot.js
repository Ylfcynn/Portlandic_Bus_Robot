"use strict";

/*
jQuery(document).ready(function() {
});
*/

let map;
let stopMarkers = new Array();

let location_options = {
    enableHighAccuracy: true,
    maximumAge        : 30000,
    timeout           : 27000
};


function addStopToTable(index, busStop) {
  // Makes an entry with the table structure below
  // <tr>
  //   <th scope="row">1</th>
  //   <td></td>
  //   <td></td>
  //   <td>@</td>
  // </tr>
  let busStopIndex = jQuery("<th>", {"scope": "row"}).text(index+1);
  let busLocID = jQuery("<td>").text(busStop.locid);
  let busStopDesc = jQuery("<td>").text(busStop.desc);
  let busHeading = jQuery("<td>").text(busStop.dir);
  let busStopRow = jQuery("<tr>").append(busStopIndex, busLocID, busHeading, busStopDesc);
  jQuery("#busses").append(busStopRow);
}

function makeInfoWindow(busStop) {
    // Generates and adds infoWindow HTML to Google Maps marker objects
    let $heading = jQuery("<h4>").append(`${busStop.locid} is a ${busStop.dir} Neko Bus.\nNice kitteh.`);
    let $description = jQuery("<blockquote>").text(busStop.desc);

    let $body = jQuery("<section>").append($heading, $description);
    let $content = jQuery("<main>").append($heading, $body);
    return $content.html();
}

function addBusStopMarker(busStop) {
    // Adds a single bus stop to the map
    let busStopLoc = new google.maps.LatLng(busStop.lat, busStop.lng);
    let iconPath = "static/img/猫.png";
    let stopMarker = new google.maps.Marker({
        position: busStopLoc,
        title: busStop.desc,
        icon: iconPath
    });

    let contentString = makeInfoWindow(busStop);

    let infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    stopMarker.addListener('click', function() {
        infowindow.open(map, stopMarker);
    });

    // To add the marker to the map, call setMap();
    stopMarkers.push(stopMarker);
    stopMarker.setMap(map);
    console.log("OK");
}


function inlayData(stops, arrivals) {
    // Adds all bus stops and arrivals within range to the map and table
    jQuery.each(stops, function(index, busStop) {
        console.log("Thar be busses!");
        addStopToTable(index, busStop);     //
        addBusStopMarker(busStop);          // Adds this stopMarker to the map
        addArrivalsToTable(arrivals);
    });
}

/*

This is ECMAScript v6 AJAX:

jQuery.ajax({

    type: "GET",
    data: request_params,
    url: "https://developer.trimet.org/ws/V1/stops"
}).done(function(response) {
    // You may safely use results here
    let stops = response.resultSet.location;
    inlayData(stops);
}).fail(function(error) {
    console.log(error);
});

*/

function fetchArrivals() {
    jQuery.ajax({

        type: "GET",
        data: {
          "appID": "CA8E1B6081BE37144D1BD33E7",
          "json": "true",
          "locID": "3116"
        },
        url: "https://developer.trimet.org/ws/V2/arrivals"
    }).done(function(response) {
        // You may safely use results here
        let arrivals = response.resultSet.arrival;
        inlayData(arrivals);
    }).fail(function(error) {
        console.log(error);
    });
}

function fetchBusStops(latitude, longitude, meters) {
    if (typeof meters === "undefined") {
        let meters = "300";  // This...is...Sparta!
    }
    jQuery.ajax({                                 // This is AJAX, a jQuery function.
              url: "https://developer.trimet.org/ws/V1/stops",   // <-- Endpoint
              method: "GET",                      // <-- HTTP method "verb"
              data: {
                      "appID": "CA8E1B6081BE37144D1BD33E7",
                      "ll": `${latitude},${longitude}`,
                      "meters": meters,
                      "json": "true",
                    },                            // <-- Request parameters
              success: function(response){        // <-- "Success handler"
                  console.log('Fetched new geolocation data');

                  let stops = response.resultSet.location;
                  inlayData(stops);
              },
              error: function(error){             // <-- "Error handler"
                  console.log(error);
              }
      });
}


/*
function getLocation() {
    navigator.geolocation.getCurrentPosition(function(userLocation) {
        let latitude = userLocation.coords.latitude;
        let longitude = userLocation.coords.longitude;
        initMap(latitude, longitude);
        fetchBusStops(latitude, longitude);
    });
}
*/

function initMap(latitude, longitude) {
  let position = {lat: latitude, lng: longitude};
  map = new google.maps.Map(document.getElementById("map"), {
      zoom: 17,
      center: position
  });
  let marker = new google.maps.Marker({
      position: position,
      map: map
  });
  console.log("I know where you are...");
}


function location_error() {
  // alert("Ack! No location data available!");
  console.log("No location data available");
}

function everyBreathYouTake() {
    //
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(function(newLocation) {
            let latitude = newLocation.coords.latitude;
            let longitude = newLocation.coords.longitude;
            console.log(`${latitude}, ${longitude}`);
            initMap(latitude, longitude);
            fetchBusStops(latitude, longitude);
            fetchArrivals();
        }, location_error, location_options);
    } else {
        location_error();
    }
}

function setMapOnAll(map) {
    //
    jQuery.each(stopMarkers, function(index, stopMarker) {
        stopMarker.setMap(map);
    });
    // for (let i=0; i<stopMarkers.length; i++) {
    //     stopMarkers[i].setMap(map);
    // }
}


function clearMarkers() {
    //
    setMapOnAll(null);
}


function clearTable() {
    //
    jQuery("#busses").empty();
}


function wipeData() {
  //
  clearMarkers();
  clearTable();
}


function updateStops(event, ui) {
    //
    wipeData();
    navigator.geolocation.getCurrentPosition(function(position) {
        fetchBusStops(position.coords.latitude, position.coords.longitude, ui.value);
        fetchArrivals();
    });
}

jQuery(function() {
    //
    let handle = jQuery("custom-handle");
    let options = {min: 50, max: 1500, value: 125, step: 25,
        create: function() {
            console.log("Slider is GO for launch.");
            handle.text(jQuery(this).slider("value"));
        },
        slide: function(event, ui) {
            handle.text(`${ui.value}m`);
        },
        stop: updateStops
    };
    jQuery("#slider").slider(options);
});

everyBreathYouTake();
