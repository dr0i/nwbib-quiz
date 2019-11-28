define(
		[ "jquery", "icons", "fancybox", "leaflet" ],
		function($, icons, fancybox, leaflet) {
			return function(map, markerGroup, mapPositionHandler, gameData) {
				var scores = 0;

				var getThisRoundScore = function(distance) {
					if (distance < 10000) {
						return 100;
					} else if (distance < 15000) {
						return 85;
					} else if (distance < 20000) {
						return 70;
					} else if (distance < 25000) {
						return 55;
					} else if (distance < 30000) {
						return 40;
					} else if (distance < 35000) {
						return 25;
					} else {
						return 0;
					}
				};

				var addInfobox = function(map) {
					this._div = leaflet.DomUtil.create('div', 'info');
					this.update();
					return this._div;
				};

				var checkLocation = function() {
					var realMarker = leaflet.marker(mapPositionHandler
							.getRealMarkerPosition(), {
						draggable : false
					});
					realMarker.setIcon(icons.redIcon);
					realMarker.addTo(markerGroup);

					var distance = map.distance(mapPositionHandler
							.getMarkerPosition(), mapPositionHandler
							.getRealMarkerPosition())
					var thisRoundScore = getThisRoundScore(distance);
					scores = scores + thisRoundScore;

					distanceStr = Math.round(distance.toFixed(0)/1000) + " km"

					var lastSentence;
					if (gameData.hasNextRound()) {
						lastSentence = "Ihre Punkte nach dieser Runde: "
								+ scores;
					} else {
						lastSentence = "Sie haben " + scores
								+ " von 500 Punkten erreicht.";
						scores = 0;
					}

					alert("Diese Stadt ist " + distanceStr
							+ " von " + gameData.getCityName() + " entfernt."
							+ "\nSie bekommen " + thisRoundScore + " Punkte."
							+ "\n" + lastSentence);

					if (gameData.hasNextRound()) {
							nextLocation();
					} else {
						$("#checkLocationButton").html('Neu starten');
						$("#checkLocationButton").unbind('click');
						$("#checkLocationButton").on('click', function(e) {
							gameData.resetAll();
							nextLocation();
						});
					}
				};

				var nextLocation = function() {
					while (!gameData.nextPhoto()) {
						// retrying
					}

					mapPositionHandler.setRealMarkerPosition(gameData
							.getImageGeoPosition())
					markerGroup.eachLayer(function(layer) {
						map.removeLayer(layer);
					});
					$("#checkLocationButton").unbind('click');
					$("#checkLocationButton").html('Prüfe Position');
					$("#checkLocationButton").prop('disabled', 'disabled');
					$("#checkLocationButton").on('click', function(e) {
						checkLocation();
					});
					$("#photo").prop('src', gameData.getImageUrl());

					gameData.setRoundInit(false);
				}

				var updateInfobox = function(id, props) {
					var htmlInner = '<div style="width: 300px">';
					htmlInner += '<h4>Finde den Standort des angezeigten Fotos</h4>'
					htmlInner += '<button id="checkLocationButton">Prüfe Position</button>'
					var imageUrl = gameData.getImageUrl();
					var imageGeoPosition = gameData.getImageGeoPosition();
					htmlInner += '<br /><br /><div id="damalsPhotoContainer">'
							+ '<img id="photo" src="'
							+  imageUrl
							+ '" style="max-width:295px" /></div>'
					mapPositionHandler.setRealMarkerPosition(leaflet.latLng(
							imageGeoPosition[0], imageGeoPosition[1]))
					this._div.innerHTML = htmlInner;
				};

				var info = leaflet.control();

				info.update = updateInfobox;
				info.onAdd = addInfobox;

				info.addTo(map);

				$("#checkLocationButton").prop('disabled', 'disabled');
				$("#checkLocationButton").on('click', function(e) {
					checkLocation();
				});
			};
		});
