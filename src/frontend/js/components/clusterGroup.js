class ClusterGroup {

    constructor() {
        this.mapLayerGroup = L.layerGroup();
        this.clusterGroup =  L.markerClusterGroup({ // create cluster group for recreation point markers (campsite, access points, etc.)
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            removeOutsideVisibleBounds: true,
            disableClusteringAtZoom: 15,
            iconCreateFunction :    function (cluster){
                var cluster_markers = cluster.getAllChildMarkers();
                var n = 0;
                    n += cluster_markers.length;

                var scaledSize = Math.min(80, Math.max(30, n));

               //console.log(scaledSize); 

    
                return  L.divIcon({
                    html: '<div class="mycluster1"><img src="../../src/frontend/assets/tent.svg" alt="Tent"><div class="cluster-text">' + n + '</div></div>',
                    className: 'mycluster1',
                    iconSize: L.point(scaledSize, scaledSize)
                });
            } 
        },
        
        
        
        ).addTo(this.mapLayerGroup);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // initialize map with tile layer 
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.clusterGroup);

        
        this.baseURL = "http://52.15.34.182:8080/geoserver/wfs?service=wfs&version=2.0.0&request=getfeature&typename="; //Geographic Web File Service
        this.respFormat = "&outputFormat=application/json";
        this.markers = this.addLayer('Rec_point');
        this.path = undefined;
    }

    async addLayer(layerName) {
        this.getLayer(layerName)
            .then((data) =>  {
                const layer = this.setMarkerStyles(data); // customize layer icons 
                layer.addTo(this.clusterGroup); // add layer to layer group
                console.log(layer);
            })
            .catch(err => console.log("Rejected: " + err.message));
    }
    
    async addPath(sourceID, targetID) {
        if(this.path != undefined) this.path.remove();
        this.getPath(sourceID, targetID)
        .then(data =>  this.path = L.geoJSON(data).addTo(this.mapLayerGroup)) // add layer to layer group
        .catch(err => console.log("Rejected: " + err.message));
    }
        
    async getLayer(layerName) {
        console.log(this.baseURL + layerName + this.respFormat);
        const response = await fetch(this.baseURL + layerName + this.respFormat);
        const geoJSON = await response.json();
       
        return geoJSON;
    }
    
    async getNearestVertex(point) {
        var url = `${this.baseURL}nearest_vertex${this.respFormat}&viewparams=x:${point.lng};y:${point.lat};`;
        const response = await fetch(url);
        return response.json();
    }
    
    async getPath(sourceID, targetID) {
        var url = `${this.baseURL}shortest_path${this.respFormat}&viewparams=source:${sourceID};target:${targetID};`;
        const response = await fetch(url);
        // console.log(response);
        return response.json();
    }

    setMarkerStyles(layer) {
        const icons =  { // icon styles for various features
            "Designated Camping Site": L.icon({
                iconUrl: '../../src/frontend/assets/tent.svg',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
            }),
            
            "Access Point": L.icon({
                iconUrl: '../../src/frontend/assets/access.svg',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
            }),
    
    
        };
    
        layer = L.geoJSON(layer, { // process function for each feature from geoJSON
            pointToLayer: function (feature, latlng) {
                const subtype = feature.properties.SUBTYPE; // get the subtype of the feature from geoJSON file
                
                if (subtype in icons) {
                    return L.marker(latlng, { icon: icons[subtype] }); // assigned the icon for a feature 
                } else {
                    console.log("Subtype not found in icons dict");
                }
            }
        });
    
        return layer;
    }
    
    
}

export default ClusterGroup;