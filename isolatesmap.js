function langMap(latitude,longitude, zoom) {
	var map = L.map('map').setView([latitude,longitude], zoom);

	L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://maps.google.com/">Google Maps</a>',
		id: 'mapbox/light-v9',
        subdomains:['mt0','mt1','mt2','mt3']
	}).addTo(map);
/*	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11'
	}).addTo(mymap);*/

	function onEachFeature(feature, layer) {
		var popupContent = feature.properties.family == null || feature.properties.family == "" ?
		    "<p><b>" + feature.properties.label + "</b><br/>Family: Isolate</p>" : 
		    "<p><b>" + feature.properties.label + "</b><br/>Family: " + feature.properties.family + "</p>";

		if (feature.properties && feature.properties.popupContent) {
			popupContent += feature.properties.popupContent;
		}
		
		if (feature.properties && feature.properties.family != null) {
			if  (!familyList.has(feature.properties.family)) {
				familyList.add(feature.properties.family);
			}
		}

		layer.bindPopup(popupContent);
	}
	
	var familyList = new Set()
	
	function countLanguages(feature, layer) {
		if  (!familyList.has(feature.properties.family)) {
			familyList.add(feature.properties.family);
		}
	}

	L.geoJSON(languages, {
		onEachFeature: countLanguages
	});
	
	var seq = palette('tol-rainbow', familyList.size);
	var familyArray = Array.from(familyList);
	var familyToColor = {};
	for (i=0; i < familyArray.length; i++) {
		familyToColor[familyArray[i]] = seq[i];
	}
	
	function pointToLayerFunc(feature, latlng) {
		if (feature.properties.family == null || feature.properties.family == "" || feature.properties.family == "Isolate") {
			return L.circleMarker(latlng, {
				radius: 7,
				fillColor: "#fff",
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			});
		}
		else {
			return L.circleMarker(latlng, {
					radius: 7,
					fillColor: "#" + familyToColor[feature.properties.family],
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8
				});
		}
	}

	L.geoJSON(languages, {

		style: function (feature) {
			return feature.properties && feature.properties.style;
		},

		onEachFeature: onEachFeature,

		pointToLayer: pointToLayerFunc
		
	}).addTo(map);
}