var map; 
var mapLayerGroup;

function initMap(park) {
    initMapDiv(); // show map in container

    map = L.map("map", {
        center: [-78.40, 45.84],
        zoom: 9 //set the zoom level
    });

    mapLayerGroup = L.layerGroup(); // create new layer group

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // initialize map with tile layer 
    maxZoom: 9,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapLayerGroup);

    const marker = L.marker([45.84, -78.40]);

    mapLayerGroup.addLayer(addLayerNew());
    mapLayerGroup.addLayer(marker);
    mapLayerGroup.addTo(map); // add layer group to map
    map.setView([45.84, -78.40], 10); // set map view to specified coordinates and zoom level
}   

function initMapDiv() {
    var mapDiv = document.getElementById("map");

    mapDiv.style.display = "block"; // display map in map container
    mapDiv.style.height = "600px";
    mapDiv.style.width = "90%";
    removeChooseParkBtn(); // remove select park button 
}

function removeChooseParkBtn() {
    var parkBtn = document.getElementById("park-btn");
    parkBtn.style.display = "none";
}

var baseURL = "http://52.15.34.182:8080/geoserver/wfs?service=wfs&version=2.0.0&request=getfeature&typename="; //Geographic Web File Service

function getLayer(layerName) {
    fetch(baseURL + layerName)
    .then(response => {
        if(!response.ok) {
            throw new Error('Error: Invalid Response');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function addLayerNew (layerName) {
    // make api call to backend to get layer from geoserver
    const layer = getLayer('Rec_point');

    return layer;
}
