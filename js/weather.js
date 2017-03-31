/*
 * weather.js - Joshua Calder 
 * Takes a user input location and finds correspoding longitude and latitude coordinates,
 * in addition to the weather for that location. 
 * If the weather is "bad" (under 15 celcius), the user is told to wear a coat.
 * In the future, a rain checking functionality will also be added.
 *
 * Powered By Dark Sky API and Google Maps API
 */

var lat;
var lng;
var loc;
var temperature;

/* 
 * Geolocates user text input by pulling JSON data from Google Maps Javascript API.
 * Then, looks up current weather for geolocation via Dark Sky API.
 * Error handling implemented for when an invalid location is entered.
 * 
 * In order to use this method, you must get your own Google Maps API key and Dark Sky key.
 * Both are free and can be found at: https://darksky.net/dev/docs & 
 * https://developers.google.com/maps/documentation/javascript/get-api-key
 * Simply replace PUTYOURKEYHERE with your own key. 
*/
function lookUp() {
	loc = $('#location').val();
	$.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+loc+",&key=PUTYOURKEYHERE", function(mData) {
		try {
			lat = mData.results[0].geometry.location.lat;
		}
		catch(err) {
			$('#data').html("Sorry, we can't find that place!");
		}
		lng = mData.results[0].geometry.location.lng;
		$.getJSON("https://api.darksky.net/forecast/PUTYOURKEYHERE/"+lat+","+lng+"?units=si", function(data) {
			temperature = round(data.currently['temperature']);
			$('#temp').html("The temperature is "+(temperature) + " <sup>o</sup>C");
			coatCheck(temperature);
		});
		$('#city').text(mData.results[0].formatted_address);	
	})
	.fail(function() { 
		alert("Sorry, something went wrong..");
	});
}

$(document).ready(function(){
	$("#getWeather").click(function (){
		console.log("button pressed");
		if ($('input:text').val().length > 0) {
			lookUp();
		}
	});
});

// round numerical value to 1 decimal
function round(value) {
	return Number(Math.round(value+'e'+1)+'e-'+1);
}

/* 
 * Checks it enter key pressed when inputting text
 * Also checks if text field length > 0
*/
function handle(e) {
 	var key = e.keyCode || e.which;
 	if (key == 13 && $('input:text').val().length > 0){
  		lookUp();
	}
}

/* 
 * Checks if the temp is < 15. Tells user to wear a coat if it is.
*/
function coatCheck(temp) {
	if (temperature < 15) {
		$('#ans').html("Yes, you should probably wear a jacket in");
	} else {
		$('#ans').html("No, it doesn't look like you need to wear a jacket in ");
	}
}

