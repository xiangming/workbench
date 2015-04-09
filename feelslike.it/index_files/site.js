$("document").ready(function() {
	getLocation()
});
$(function() {
	$("#shots > .rotate:gt(0)").hide();
	setInterval(function() {
		$("#shots > .rotate:first").fadeOut(300).next().fadeIn(300).end().appendTo("#shots")
	}, 3500)
});

function getLocation() {
	$.ajax({
		url: "http://www.telize.com/geoip",
		dataType: "jsonp",
		timeout: 5000,
		success: function(data) {
			var lat = data.latitude;
			var lon = data.longitude;
			var city = data.city;
			var country = data.country_code;
			if ((country === "US") || (country === "PR") || (country === "BZ") || (country === "GU") || (country === "PW") || (country === "VI")) {
				var units = "us"
			} else {
				var units = "si"
			}
			getWeather(lat, lon, country, city, units)
		},
		error: function() {
			$("#loader").fadeOut("fast");
			$("#city").hide();
			$("#temperature").hide();
			$("#degrees").hide();
			$("h1").css("font-weight", "500");
			$("#currently").addClass("a0")
		}
	})
}

function getWeather(lat, lon, country, city, units) {
	proxy = "proxy.php";
	$.ajax({
		url: proxy + "?url=" + lat + "," + lon + "?units=" + units + "&exclude=minutely,hourly,flags",
		dataType: "json",
		timeout: 5000,
		success: function(data) {
			$("#loader").fadeOut(350);
			if (units === "us") {
				var bgTemp = (data.currently.apparentTemperature.toFixed(0) - 32) * (5 / 9)
			} else {
				var bgTemp = data.currently.apparentTemperature.toFixed(0)
			}
			var currentTemp = data.currently.apparentTemperature.toFixed(0);
			var currentSummary = data.currently.summary;
			$("#city").html(city);
			$("#temperature").html(currentTemp);
			$("#cityforecast").html(city);
			if (bgTemp < -20) {
				$("#currently").addClass("b20")
			}
			if (bgTemp >= -20 && bgTemp <= -10) {
				$("#currently").addClass("b10")
			}
			if (bgTemp > -10 && bgTemp <= 0) {
				$("#currently").addClass("b0")
			}
			if (bgTemp > 0 && bgTemp <= 10) {
				$("#currently").addClass("a0")
			}
			if (bgTemp > 10 && bgTemp <= 20) {
				$("#currently").addClass("a10")
			}
			if (bgTemp > 20 && bgTemp <= 25) {
				$("#currently").addClass("a20")
			}
			if (bgTemp > 25 && bgTemp <= 30) {
				$("#currently").addClass("a25")
			}
			if (bgTemp > 30 && bgTemp <= 35) {
				$("#currently").addClass("a30")
			}
			if (bgTemp > 35 && bgTemp <= 40) {
				$("#currently").addClass("a35")
			}
			if (bgTemp > 40) {
				$("#currently").addClass("a40")
			}
		},
		error: function() {
			$("#loader").fadeOut("fast");
			$("#city").hide();
			$("#temperature").hide();
			$("#degrees").hide();
			$("h1").css("font-weight", "500");
			$("#currently").addClass("a0")
		}
	})
};