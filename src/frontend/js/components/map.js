import ClusterGroup from "./clusterGroup.js";
import { mapSettings } from "./mapSettings.js";

export class Map {
    constructor(park) {
        this.map;
        this.park;
        this.clusterGroup = new ClusterGroup();
        this.sourceID = 38509;
        this.targetID = 5742; //change to a list of target IDs
        this.directionMarkers = [];
        this.srt_view = [45.80, -78.40];
        this.SW = [45.00, -80.00];
        this.NE = [46.50 , -77.00];

        this.bounds;
        this.MapSettings = new mapSettings();
    }

    initMapDiv() {
        var mapDiv = document.getElementById("map");

        mapDiv.style.display = "block"; // display map in map container
        mapDiv.style.height = "100%";
        mapDiv.style.width = "100%";
        // this.removeChooseParkBtn(); // remove select park button

        var sidebar = L.control.sidebar('sidebar').addTo(this.map);
        console.log("Sidebar Added: ", sidebar);
    }

    initMap(park) {
        this.park = park;
        this.initMapDiv(); // show map in container

        
        this.map = L.map("map", {
            center: this.srt_view,
            zoom: 9, //set the zoom level
            minZoom: 8,
            maxZoom: 16,
           maxBounds: L.latLngBounds(this.SW, this.NE)
    

        });

        // L.control.bigImage({position: 'topright'}).addTo(this.map);

        this.clusterGroup.mapLayerGroup.addTo(this.map); // add layer group to map
        this.map.setView(this.srt_view, 9); // set map view to specified coordinates and zoom level
        addStartMarkers(this); // add route planning markers
    }

    showFeatureIcon(feature) {
        this.clusterGroup.showLayer(feature);
    }
    
    hideFeatureIcon(feature) {
        this.clusterGroup.hideLayer(feature);
    }

    async addDirectionsToSidebar(pdata) {
        for(let marker of this.directionMarkers) {
            marker.remove();
        }
        this.directionMarkers = [];

        const data = await this.clusterGroup.createDirectionsFromPath(pdata);
        
        const outputDiv = document.getElementById('directions-table');
        outputDiv.innerHTML = '';
    
        data.forEach((item, index) => {
            const liElement = document.createElement('div');
            liElement.classList.add('table-row');
    
            liElement.innerHTML = `
                <div class="table-cell ...">${item.name}</div>
                <div class="table-cell ...">${item.distance}</div>`;
    
            outputDiv.appendChild(liElement);

            if(this.MapSettings.dispdir) {
                var marker = L.marker([item.pos[1], item.pos[0]]).addTo(this.map);
                marker.bindPopup(`${item.name}\nType: ${item.type}`);
                this.directionMarkers.push( marker );
            }
        });
    }

    // extract route information into dictonary for PDF
    getRouteInfo() {
        const routeInfo = {};
        
        routeInfo.route = "A route";
        routeInfo.crew = "Thomas Adam Gryphon";
        routeInfo.distances = "1000, 231, 500, 564";
        routeInfo.portages = "943, 321, 432, 50";
        routeInfo.totalPortage = "1500m";
        routeInfo.totalCanoe = "5000m";

        return routeInfo;
    }

    getMapImg() {
        let self = this;

        self.tilesImgs = {};
        self.markers = {};
        self.path = {};
        self.circles = {};

        let dimensions = self.map.getSize();

        self.zoom = self.map.getZoom();
        self.bounds = self.map.getPixelBounds();

        self.canvas = document.createElement('canvas');
        self.canvas.width = dimensions.x;
        self.canvas.height = dimensions.y;
        self.ctx = self.canvas.getContext('2d');

        // this.changeScale(document.getElementById('scale').value);
        // this.changeScale(1);

        let promise = new Promise(function (resolve, reject) {
            self.map.getLayers(resolve);
        });
        promise.then(() => {
            return new Promise(((resolve, reject) => {
                for (const [key, layer] of Object.entries(self.tilesImgs)) {
                    for (const [key, value] of Object.entries(layer)) {
                        self.ctx.globalAlpha = value.opacity;
                        self.ctx.drawImage(value.img, value.x, value.y, self.tileSize, self.tileSize);
                        self.ctx.globalAlpha = 1;
                    }
                }
                for (const [key, value] of Object.entries(self.path)) {
                    self._drawPath(value);
                }
                for (const [key, value] of Object.entries(self.markers)) {
                    if (!(value instanceof HTMLImageElement) && !value.img) {
                        self._drawText(value, value.x, value.y);
                    } else {
                        self.ctx.drawImage(value.img, value.x, value.y);
                    }
                }
                for (const [key, value] of Object.entries(self.circles)) {
                    self._drawCircle(value);
                }
                resolve();
            }));
        }).then(() => {
            self.canvas.toBlob(function (blob) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onloadend = function () {
                    console.log(reader.result);
                }

                // let link = document.createElement('a');
                // link.download = "mapExport.png";
                // link.href = URL.createObjectURL(blob);
                // link.click();
            });
            self._containerParams.classList.remove('print-disabled');
            self._loader.style.display = 'none';
        });
    }
}

export default Map;

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
        autoPan: true, icon : canoe_iconS}).addTo(map.map);

        var end = L.marker([45.60012744 ,  -78.77631902 ], {draggable: true,
            autoPan: true, icon: canoe_iconE}).addTo(map.map);
        
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

