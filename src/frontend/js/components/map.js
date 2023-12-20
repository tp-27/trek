import ClusterGroup from "./clusterGroup.js";
import { mapSettings } from "./mapSettings.js";

export class Map {
    constructor() {
        this.map;
        this.clusterGroup = new ClusterGroup();
        this.sourceID = 17;
        this.targetID = 5742; //change to a list of target IDs
        this.srt_view = [45.84, -78.40];
        this.markers = {};
        this.MapSettings = new mapSettings();
    }

    initMapDiv() {
        var mapDiv = document.getElementById("map");

        mapDiv.style.display = "block"; // display map in map container
        mapDiv.style.height = "600px";
        mapDiv.style.width = "90%";
        this.removeChooseParkBtn(); // remove select park button

        var sidebar = L.control.sidebar('sidebar').addTo(this.map);
        console.log("Sidebar Added: ", sidebar);
    }

    initMap() {
        this.initMapDiv(); // show map in container

        this.map = L.map("map", {
            center: [-78.40, 45.84],
            zoom: 9, //set the zoom level
            minZoom: 1,
            maxZoom: 18
        });

        this.clusterGroup.mapLayerGroup.addTo(this.map); // add layer group to map

        // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // initialize map with tile layer 
        // maxZoom: 18,
        // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        // }).addTo(this.clusterGroup);

        this.map.setView(this.srt_view, 20); // set map view to specified coordinates and zoom level

        addStartMarkers(this);
    }

    removeChooseParkBtn() {
        var parkBtn = document.getElementById("park-btn");
        parkBtn.style.display = "none";

        var navBar = document.getElementById("sidebar");
        navBar.style.display = "block";
    }

    showFeatureIcon(feature) {
        showFeatureIcon(feature, clusterGroup);
    }
    
    hideFeatureIcon(feature) {
        showFeatureIcon(feature, clusterGroup);
    }

    async addDirectionsToSidebar(pdata) {
        const data = await this.clusterGroup.createDirectionsFromPath(pdata);
        console.log("Adding Directions: ", pdata);
        const ulElement = document.createElement('ul');
        const outputDiv = document.getElementById('route-directions');
        outputDiv.innerHTML = '';
        data.forEach((item, index) => {
            const liElement = document.createElement('li');
            liElement.innerHTML = `Name: ${item.name} - &nbsp;${item.distance}m`;

            ulElement.appendChild(liElement);
        });
        outputDiv.appendChild(ulElement);
    }
}

export default Map;

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
  
    var start = L.marker((map.srt_view), {draggable: true,
        autoPan: true, icon : canoe_icon}).addTo(map.map);

    var end = L.marker([45.84, -78.10], {draggable: true,
        autoPan: true, icon: canoe_icon}).addTo(map.map);
        
    start.bindPopup("Start" +  start.getLatLng());
    end.bindPopup("End." + end.getLatLng());
    
    start.on('dragend', async function(event) {
        var S_latlng = event.target.getLatLng();
        // console.log("START: ", S_latlng.lat, S_latlng.lng)
        start.bindPopup("Start" +  start.getLatLng());
        var sResponse = await map.clusterGroup.getNearestVertex(S_latlng);
        var sGeometry = sResponse.features[0].geometry.coordinates;
        map.sourceID = sResponse.features[0].properties.id;
         //console.log("SOURCE ID ", map.sourceID);
            var sLat = sGeometry[1];
        var sLng = sGeometry[0];
        // console.log(sLat, sLng);
        var sNewLL = new L.LatLng(sLat,sLng);
        start.setLatLng(sNewLL);
        var pdata = await map.clusterGroup.addPath(map.sourceID, map.targetID);
        map.addDirectionsToSidebar(pdata);
    });
        
        
    end.on('dragend', async function(event) {
        var E_latlng = event.target.getLatLng();
        // console.log("END: ", E_latlng.lat, E_latlng.lng)
        end.bindPopup("End." + end.getLatLng());
        var response = await map.clusterGroup.getNearestVertex(E_latlng);
        var geometry = response.features[0].geometry.coordinates;
        map.targetID = response.features[0].properties.id;
        //  console.log("TARGET ID ", targetID);
            var lat = geometry[1];
        var lng = geometry[0];
        console.log(lat, lng);
        var newLL = new L.LatLng(lat,lng);
        end.setLatLng(newLL);
        var pdata = await map.clusterGroup.addPath(map.sourceID, map.targetID);
        map.addDirectionsToSidebar(pdata);
    });
}

