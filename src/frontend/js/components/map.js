
import { addLayer, getNearestVertex, addPath } from "./mapUtils.js";

var map; 
var clusterGroup;
var mapLayerGroup;
var sourceID = 38509, targetID = 5742;
var srt_view = [45.80, -78.40];
var southWest = L.latLng(45.00, -80.00),
    northEast = L.latLng(46.50 , -77.00),
    bounds = L.latLngBounds(southWest, northEast);
var markers = {};

export function initMap() {
    initMapDiv(); // show map in container

    map = L.map("map", {
        center: srt_view,
        maxBounds: bounds,         
        zoom: 9, //set the zoom level
        minZoom: 8,
        maxZoom: 16
        
    });

    mapLayerGroup = L.layerGroup();
    clusterGroup = L.markerClusterGroup({ // create cluster group for recreation point markers (campsite, access points, etc.)
        iconUrl: "../../src/frontend/assets/Start_canoe.png",
        //icon: canoe_icon,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        removeOutsideVisibleBounds: true,
        disableClusteringAtZoom: 15,

        iconCreateFunction: function (cluster) {
            var className = 'mycluster'
            var cluster_markers = cluster.getAllChildMarkers();
            //console.log(cluster_markers.length);
            var n = 0;
            //for (var i = 0; i < cluster_markers.length; i++) {
                n += cluster_markers.length;
               // console.log("Marker number:", cluster_markers[i].length);
           // }
            var scaledSize = Math.min(80, Math.max(30, n));
            //var hue = (scaledSize / 200) * (200 - 0) + 0;
            //var html =  "background-color: hsl(" + hue + ", 100%, 50%);"
           // console.log(html);
            //console.log(n);
           //if(scaledSize >= 60){
           console.log(scaledSize); 
           className = 'mycluster1';
          // }
          // else if(scaledSize >= 55){
          //  className = 'mycluster2';
          // }    
          // else if(scaledSize >= 35){
           // className = 'myCluster3';
          // }
          // else{
           // className = 'myCluster4';
          // }

            return  L.divIcon({
                html: '<div class="mycluster1"><img src="../../src/frontend/assets/tent.svg" alt="Tent"><div class="cluster-text">' + n + '</div></div>',
                className: 'mycluster1',
                iconSize: L.point(scaledSize, scaledSize)
            });
                
        }
        

    }).addTo(mapLayerGroup);

    mapLayerGroup.addTo(map); // add layer group to map

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // initialize map with tile layer 
    maxZoom: 16,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(clusterGroup);

    map.setView(srt_view, 9); // set map view to specified coordinates and zoom level

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
    var canoe_iconS = L.icon({
        iconUrl: "../../src/frontend/assets/Start_canoeS.png",
        //shadowUrl: "../../src/frontend/assets/leaf-shadow.png",
    
        iconSize:     [38, 95], // size of the icon
       // shadowSize:   [50, 64], // size of the shadow
       // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
       // shadowAnchor: [4, 62],  // the same for the shadow
       // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    var canoe_iconE = L.icon({
        iconUrl: "../../src/frontend/assets/Start_canoeE.png",
        //shadowUrl: "../../src/frontend/assets/leaf-shadow.png",
    
        iconSize:     [38, 95], // size of the icon
       // shadowSize:   [50, 64], // size of the shadow
       // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
       // shadowAnchor: [4, 62],  // the same for the shadow
       // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

  
    var start = L.marker(([45.844645909959816 , -78.3995533866199]), {draggable: true,
        autoPan: true, icon : canoe_iconS}).addTo(map);

        var end = L.marker([45.60012744 ,  -78.77631902 ], {draggable: true,
            autoPan: true, icon: canoe_iconE}).addTo(map);
        
        start.bindPopup("Start" +  start.getLatLng());
        end.bindPopup("End." + end.getLatLng());
    
        start.on('dragend', async function(event) {
            var S_latlng = event.target.getLatLng();
             console.log("START: ", S_latlng.lat, S_latlng.lng)
            start.bindPopup("Start" +  start.getLatLng());
           var sResponse = await getNearestVertex(S_latlng);
            var sGeometry = sResponse.features[0].geometry.coordinates;
             sourceID = sResponse.features[0].properties.id;
             console.log("SOURCE ID ", sourceID);
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
              console.log("TARGET ID ", targetID);
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




