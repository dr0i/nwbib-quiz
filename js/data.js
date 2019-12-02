define({
	geojsonFile: "http://localhost/nwbib-quiz/places.geojson",
	mapConfig: {
		center: [51.413888888, 7.265277777],
		zoom: 8,
		maxZoom: 10,
		minZoom: 6,
		attribution: 'Map data &#64; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors</a>',
		mapWarperAttribution: 'Map data &#64; <a href="http://mapwarper.net/">MapWarper</a> contributors</a>'
	},
	gameData: function() {
		var scores = {score: 0};
		var index = 0;
		var roundInit = false;
		var alreadyPlayed = [];
		var data = undefined;
		var imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Dortmund_Panorama.jpg/320px-Dortmund_Panorama.jpg";
		var imageGeoPosition = [50.942222222, 6.957777777];

		var createNewIndex = function() {
			return Math.floor(Math.random() * Math.floor(data.features.length));
		};
		var startGame = function() {
			alreadyPlayed = [];
			index = Math.floor(Math.random() * Math.floor(data.features.length))
			alreadyPlayed.push(index);
		};
		
		return {
			setData: function(newData) {
				data = newData;
				startGame();
			},
			setRoundInit: function(init) {
				roundInit = init;
			},
			isRoundInit: function() {
				return roundInit;
			},
			hasNextRound: function() {
				return alreadyPlayed.length < 5;
			},
			getRound: function() {
				return alreadyPlayed.length;
			},
			resetAll: function() {
				startGame();
			},
			nextPhoto: function() {
				var newIndex = Math.floor(Math.random() * Math.floor(data.features.length))
				if (alreadyPlayed.indexOf(newIndex) == -1) {
					index = newIndex;
					alreadyPlayed.push(index);
					return true;
				} else {
					return false;
				}
			},
			getImageUrl: function() {
				if (data) {
					return data.features[index].properties["depiction"] || imageUrl;
				} else {
					return imageUrl;
				}
			},
			getCityName: function() {
				if (data) {
					return data.features[index].properties["label"] || location;
				} else {
					return imageUrl;
				}
			},
			getImageGeoPosition: function() {
				if (data) {
					var coords = data.features[index].geometry.coordinates;
					return coords ? [coords[1], coords[0]] : imageGeoPosition;
				} else {
					return imageGeoPosition;
				}
			},
			getScore: function() {
				if (data) {
					return scores.score;
				} else {
					return 0;
				}
			},
			setScore: function(newScore) {
				scores.score = newScore;
			}
		}
	}
});

