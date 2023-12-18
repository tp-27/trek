
import { addLayer, getNearestVertex, addPath } from "./mapUtils.js";

var map; 
var clusterGroup;
var mapLayerGroup;
var sourceID = 17, targetID = 5742;
var srt_view = [45.84, -78.40];
var markers = {};

export function initMap() {
    initMapDiv(); // show map in container

    map = L.map("map", {
        center: [-78.40, 45.84],
        zoom: 9, //set the zoom level
        minZoom: 1,
        maxZoom: 18
    });

    mapLayerGroup = L.layerGroup();
    clusterGroup = L.markerClusterGroup({ // create cluster group for recreation point markers (campsite, access points, etc.)
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 15
    }).addTo(mapLayerGroup);

    mapLayerGroup.addTo(map); // add layer group to map

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // initialize map with tile layer 
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(clusterGroup);

    map.setView(srt_view, 20); // set map view to specified coordinates and zoom level

    addStartMarkers(map);
    markers = addLayer('Rec_point', clusterGroup);

    addPath(mapLayerGroup);

    // // addPath(clusterGroup);
    // clusterGroup.addTo(map); // add layer group to map
}   

function initMapDiv() {
    var mapDiv = document.getElementById("map");

    mapDiv.style.display = "block"; // display map in map container
    mapDiv.style.height = "600px";
    mapDiv.style.width = "90%";
    removeChooseParkBtn(); // remove select park button
    
    var sidebar = L.control.sidebar('sidebar').addTo(map);
    console.log("Sidebar Added: ", sidebar);

}
   



async function addStartMarkers(map){
    var canoe_icon = L.icon({
        iconUrl: "../../src/frontend/assets/Start_canoe.png",
        //shadowUrl: "../../src/frontend/assets/leaf-shadow.png",
    
        iconSize:     [38, 95], // size of the icon
       // shadowSize:   [50, 64], // size of the shadow
       // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
       // shadowAnchor: [4, 62],  // the same for the shadow
       // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

  
    var start = L.marker((srt_view), {draggable: true,
        autoPan: true, icon : canoe_icon}).addTo(map);

        var end = L.marker([45.84, -78.10], {draggable: true,
            autoPan: true, icon: canoe_icon}).addTo(map);
        
        start.bindPopup("Start" +  start.getLatLng());
        end.bindPopup("End." + end.getLatLng());
    
        start.on('dragend', async function(event) {
            var S_latlng = event.target.getLatLng();
            // console.log("START: ", S_latlng.lat, S_latlng.lng)
            start.bindPopup("Start" +  start.getLatLng());
           var sResponse = await getNearestVertex(S_latlng);
            var sGeometry = sResponse.features[0].geometry.coordinates;
             sourceID = sResponse.features[0].properties.id;
            // console.log("SOURCE ID ", sourceID);
             var sLat = sGeometry[1];
            var sLng = sGeometry[0];
            // console.log(sLat, sLng);
           var sNewLL = new L.LatLng(sLat,sLng);
           start.setLatLng(sNewLL);
           addPath(mapLayerGroup, sourceID, targetID);
          });
          

        end.on('dragend', async function(event) {
            var E_latlng = event.target.getLatLng();
            // console.log("END: ", E_latlng.lat, E_latlng.lng)
            end.bindPopup("End." + end.getLatLng());
            var response = await getNearestVertex(E_latlng);
            var geometry = response.features[0].geometry.coordinates;
             targetID = response.features[0].properties.id;
            //  console.log("TARGET ID ", targetID);
             var lat = geometry[1];
            var lng = geometry[0];
            console.log(lat, lng);
           var newLL = new L.LatLng(lat,lng);
           end.setLatLng(newLL);
           addPath(mapLayerGroup, sourceID, targetID);
          });
     
}

function removeChooseParkBtn() {
    var parkBtn = document.getElementById("park-btn");
    parkBtn.style.display = "none";

    var navBar = document.getElementById("sidebar");
    navBar.style.display = "block";
}


export function showFeatureIcon(feature) {
    showFeatureIcon(feature, clusterGroup);
}

export function hideFeatureIcon(feature) {
    showFeatureIcon(feature, clusterGroup);
}




