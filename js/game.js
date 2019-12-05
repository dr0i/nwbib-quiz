define(
		[ "jquery", "icons", "fancybox", "leaflet" ],
		function($, icons, fancybox, leaflet) {
			return function(map, markerGroup, mapPositionHandler, gameData) {
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
					gameData.setScore(gameData.getScore() + thisRoundScore);
					distanceStr = Math.round(distance.toFixed(0)/1000)

					var lastSentence;
					if (gameData.hasNextRound()) {
						lastSentence = "Deine Punkte nach dieser Runde: "
						+ gameData.getScore()
					} else {
						lastSentence = "Du hast " + gameData.getScore()
								+ " von 500 Punkten erreicht.";
					}
					if (distanceStr == 0) {
						alert("=^_^=\n" + 
									"\n" +
									"Exzellent!");
	
					} else {
						alert("Die gewählte Stadt ist " + distanceStr
							+ " km von " + gameData.getCityName() + " entfernt."
							+ "\n\nDu bekommst " + thisRoundScore + " Punkte."
							+ "\n" + lastSentence);
					}

					if (gameData.hasNextRound()) {
							nextLocation();
					} else {
						updateStatus();
						$("#checkLocationButton").html('Neu starten');
						$("#checkLocationButton").unbind('click');
						$("#checkLocationButton").on('click', function(e) {
							gameData.setRoundInit(true);
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
					updateStatus();
					$("#checkLocationButton").unbind('click');
					$("#checkLocationButton").html('Prüfe Position');
					$("#checkLocationButton").prop('disabled', 'disabled');
					$("#checkLocationButton").on('click', function(e) {
						checkLocation();
					});
					$("#photo").prop('src', gameData.getImageUrl());
				}

				var updateStatus = function() {
						document.getElementById("score").innerHTML = "Runde: " + gameData.getRound() +"/5, Punkte: " + gameData.getScore() +"/500";
				}

				var updateInfobox = function(id, props) {
					var htmlInner = '<div style="width: 400px; position: fixed; left: 70px; color: black;">';
					var score_ = gameData.getScore();
					htmlInner += '<h2>Finde die Stadt!<span id="score" style="float: right"></span></h2>'
					htmlInner += '<button id="checkLocationButton" style="font-size : 20px; width: 100%; height: 100%;;margin:auto;display:block">Prüfe Position</button>'
					var imageUrl = gameData.getImageUrl();
					var imageGeoPosition = gameData.getImageGeoPosition();
					htmlInner += '<img id="photo" src="'
							+  imageUrl
							+ '" style="max-width:395px" /></div>'
					mapPositionHandler.setRealMarkerPosition(leaflet.latLng(
							imageGeoPosition[0], imageGeoPosition[1]))
					this._div.innerHTML = htmlInner;
				};

				var info = leaflet.control();
				info.update = updateInfobox;
				info.onAdd = addInfobox;
				info.addTo(map);
				updateStatus();

				$("#checkLocationButton").prop('disabled', 'disabled');
				$("#checkLocationButton").on('click', function(e) {
					checkLocation();
				});
			};
		});
