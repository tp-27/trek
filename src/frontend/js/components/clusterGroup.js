import { setMarkerStyles } from "./mapStyles.js";

export default class ClusterGroup {
    constructor() {
        this.allLayers = {}; // dictionary containing layer identifiers, layer object pairs
        this.mapLayerGroup = L.layerGroup(); // layer for route planning markers
        this.clusterGroup =  L.markerClusterGroup({ // layer for campsites, access points, picnic areas
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
        this.path = undefined; //Path Object for Leaflet
        this.pathData = undefined; //Data for path
    }

    initLayers() {
        this.mapLayerGroup = L.layerGroup();
    }

    async addLayer(layerName) {
        if (layerName in this.allLayers) { // add existing layer to the group
            this.allLayers[layerName].addTo(this.clusterGroup);
            return;
        }

        this.getLayer(layerName) // request layer if it doesn't exist
            .then((data) =>  {
                var layers = [];
                if (layerName === 'Rec_point') { 
                    layers = this.splitLayerBySubtype(data); // Split different features into individual layers - comes as one layer from geoserver
                } 

                for (const [subtype, features] of Object.entries(layers)) { // loop through individual layers
                    var styledLayer = setMarkerStyles(subtype, features); // set marker styles for each individual layer 
                    styledLayer.addTo(this.clusterGroup); // add styled layer to cluster group
                    this.allLayers[subtype] = styledLayer; // add new layer to layer dictionary
                }
            })
            .catch(err => console.log("Rejected: " + err.message));
    }

    splitLayerBySubtype(geoJSON) {
        var subTypes = {};
        var allFeatures = geoJSON.features;

        // process geoJSON and separate into individual layers
        allFeatures.forEach(function (feature) {
            var type = feature.properties.SUBTYPE;
            if (type in subTypes) { // if subtype exists - append feature to list
                subTypes[type].push(feature);
            } else {
                subTypes[type] = []; // create new key 
                subTypes[type].push(feature); // append new feature
            }
        });

        return subTypes;
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
    
    // Request a layer from the Geoserver
    async getLayer(layerName) {
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

    //pass in a string of CSVs -> "1,23,45"
    async getSegmentByIDs(IDs) {
        var url = `${this.baseURL}Algonquin_Network&cql_filter=id IN (${IDs})${this.respFormat}`;
        const response = await fetch(url);
        const obj = await response.json();
        return obj.features;
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
        if(pathData.features.length == 0) return directions;
        var startPOS = pathData.features[0].geometry.coordinates[0][0];
        var lastPathObj = await this.getSegmentByID(pathData.features[0].properties.oid);
        var pathobj;
        var oidList = "";

        //build list
        for(const edge of pathData.features) {
            oidList = oidList + edge.properties.oid + ",";
        }
        oidList = oidList.slice(0, -1);
        var pathObjects = await this.getSegmentByIDs(oidList);


        for(const pobj of pathObjects) {
            pathobj = pobj;
            
            if(lastPathObj.properties.ogf_id != pobj.properties.ogf_id && lastPathObj.properties.name != pobj.properties.name) { 
                //Distance should be included in here
                //but Algonquin_Network table must be updated with distance parameter first
                directions.push({name: pobj.properties.name, type: pobj.properties.type, pos: startPOS});

                lastPathObj = pobj;
                startPOS = pobj.geometry.coordinates[0];
            }
        }

        const geom = pathData.features[pathData.features.length - 1].geometry;
        const endPOS = geom.coordinates[0][geom.coordinates[0].length - 1];
        directions.push({name: pathobj.properties.name, type: pathobj.properties.type, pos: endPOS});

        console.log("Dir: ", directions);
        return directions;

    }
    
    hideLayer(layerName) {
        if (layerName in this.allLayers) {
            this.clusterGroup.removeLayer(this.allLayers[layerName]);
        }
    }

    showLayer(layerName) {
        if (layerName in this.allLayers) {
            this.clusterGroup.addLayer(this.allLayers[layerName]);
        }
    }

    getClusterGroup() {
        console.log(this.clusterGroup.getLayers());
        return this.clusterGroup;

    }
    
    
}
