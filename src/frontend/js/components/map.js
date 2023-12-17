import { addLayerNew } from "./addLayer.js";

var map; 
var mapLayerGroup;

export function initMap() {
    initMapDiv(); // show map in container

    map = L.map("map", {
        center: [-78.40, 45.84],
        zoom: 9, //set the zoom level
        minZoom: 1,
        maxZoom: 18
    });

    mapLayerGroup = L.layerGroup(); // create new layer group
    mapLayerGroup.addTo(map); // add layer group to map

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // initialize map with tile layer 
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapLayerGroup);

    map.setView([45.84, -78.40], 10); // set map view to specified coordinates and zoom level
    addLayerNew('Rec_point', mapLayerGroup, map);
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