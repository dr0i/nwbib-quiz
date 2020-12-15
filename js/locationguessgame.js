//var siteUrl = window.location.protocol + "//" + window.location.host + "/";
var siteUrl = "http://labs.lobid.org/nwbib-quiz/";
requirejs.config({
    baseUrl: siteUrl + "js/",
    paths: {
		"leaflet": "../assets/leaflet@1.0.3/dist/leaflet",
		"leaflet.ajax": "../assets/leaflet-ajax/2.1.0/leaflet.ajax.min",
		"jquery": "../assets/jquery/3.2.1/jquery.min",
		"fancybox": "../assets/fancybox@3.0.1/dist/jquery.fancybox.pack"
	},
    shim: {
        "fancybox": ["jquery"]
    }
});
require(["mapposition", "map", "game", "data", "leaflet"], function (mapposition, map, game, data, leaflet) {
	var mapPositionHandler = new mapposition();
	var gameData = data.gameData();
	var callback = function(geojsonData, theMap, markerGroup) {
		gameData.setData(geojsonData);
		new game(theMap, markerGroup, mapPositionHandler, gameData);
	};
	var theMap = new map(mapPositionHandler, callback, gameData);
});
