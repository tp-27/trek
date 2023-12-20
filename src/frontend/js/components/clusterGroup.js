class ClusterGroup {

    constructor() {
        this.mapLayerGroup = L.layerGroup();
        this.clusterGroup =  L.markerClusterGroup({ // create cluster group for recreation point markers (campsite, access points, etc.)
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            disableClusteringAtZoom: 15
        }).addTo(this.mapLayerGroup);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // initialize map with tile layer 
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.clusterGroup);

        
        this.baseURL = "http://52.15.34.182:8080/geoserver/wfs?service=wfs&version=2.0.0&request=getfeature&typename="; //Geographic Web File Service
        this.respFormat = "&outputFormat=application/json";
        this.markers = this.addLayer('Rec_point');
        this.path = undefined; //Path Object for Leaflet
        this.pathData = undefined; //Data for path
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
        await this.getPath(sourceID, targetID)
        .then(data =>  {
            this.pathData = data;
            this.path = L.geoJSON(data).addTo(this.mapLayerGroup)
        }) // add layer to layer group
        .catch(err => console.log("Rejected: " + err.message));
        return this.pathData
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

    async getSegmentByID(ID) {
        var url = `${this.baseURL}get_segment${this.respFormat}&viewparams=oid:${ID};`;
        const response = await fetch(url);
        const obj = await response.json();
        return obj.features[0];
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

    async createDirectionsFromPath(pathData) {
        //var path = JSON.parse(pathData);
        const directions = []
        var lastDist = pathData.features[0].properties.distance;
        var lastPathObj = await this.getSegmentByID(pathData.features[0].properties.oid);
        var i = 0;

        for(const edge of pathData.features) {
            var pobj = await this.getSegmentByID(edge.properties.oid);
            lastDist += edge.properties.distance;

            if(lastPathObj.properties.ogf_id != pobj.properties.ogf_id && lastPathObj.properties.name != pobj.properties.name) { 
                //console.log(`Path[${i}]: Dist: ${lastDist} Name: ${pobj.properties.name} Type: ${pobj.properties.type}`);

                directions.push({distance: lastDist, name: pobj.properties.name, type: pobj.properties.type});
                i++;
                lastPathObj = pobj;
                lastDist = 0;
            }
        }
        return directions;
    }
    
    
}

export default ClusterGroup;