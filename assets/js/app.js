//
//  --- our app behavior logic ---
//
var timer;

run(function() {
	// immediately invoked on first run
	var init = (function() {
		if(navigator.network.connection.type == Connection.NONE) {
			alert("No internet connection");
		} else {
			alert("Connection OK");
		}
	})();

	// a little inline controller
	when('#welcome');
	when('#settings', function() {
		// load settings from store and make sure we persist radio buttons.
		store.get('config', function(saved) {
			if(saved) {
				if(saved.map) {
					x$('input[value=' + saved.map + ']').attr('checked', true);
				}
				if(saved.zoom) {
					x$('input[name=zoom][value="' + saved.zoom + '"]').attr('checked', true);
				}
			}
		});
	});
	when('#map', function() {
		store.get('config', function(saved) {
			// construct a gmap str
			var map = saved ? saved.map || ui('map') : ui('map'), zoom = saved ? saved.zoom || ui('zoom') : ui('zoom'), path = "http://maps.google.com/maps/api/staticmap?center=";

			navigator.geolocation.getCurrentPosition(function(position) {
				var location = "" + position.coords.latitude + "," + position.coords.longitude;
				path += location + "&zoom=" + zoom;
				path += "&size=250x250&maptype=" + map + "&markers=color:red|label:P|";
				path += location + "&sensor=false";

				x$('img#static_map').attr('src', path);
				x$('#output').html('lat:' + position.coords.latitude + ', lng:' + position.coords.longitude);
			}, function() {
				x$('img#static_map').attr('src', "assets/img/gpsfailed.png");
			});
		});
	});
	when('#save', function() {
		store.save({
			key : 'config',
			map : ui('map'),
			zoom : ui('zoom')
		});
		display('#welcome');
	});
	when('.back', function() {
		display('#welcome');
	});
	when('#start_accel', function() {
		timer = setInterval("navigator.accelerometer.getCurrentAcceleration(onSuccess, onError)", 100);
		display('#accel');
	});
	when('#stop_accel', function() {
		clearInterval(timer);
		display('#accel');
	});
	when('#accel', function() {
		navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
	});
	when('#camera', function() {
		navigator.camera.getPicture(onCameraSuccess, onCameraFail, {
			quality : 50,
			destinationType : Camera.DestinationType.DATA_URL
		});
	});
});
function onSuccess(acceleration) {
	x$('#accel_output').html('Acceleration X:<br/>' + acceleration.x + '<br/>' + 'Acceleration Y:<br/>' + acceleration.y + '<br/>' + 'Acceleration Z:<br/>' + acceleration.z + '<br/>' + 'Timestamp:<br/>' + acceleration.timestamp);
}

// onError: Failed to get the acceleration    //
function onError() {
	alert('Acceleration Error!');
}

function onCameraSuccess(imageData) {
	var image = document.getElementById('myImage');
	image.src = "data:image/jpeg;base64," + imageData;
}

function onCameraFail(message) {
	alert('Failed because: ' + message);
}