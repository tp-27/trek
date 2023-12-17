const baseURL = "http://52.15.34.182:8080/geoserver/wfs?service=wfs&version=2.0.0&request=getfeature&typename="; //Geographic Web File Service
const respFormat = "&outputFormat=application/json";
var sourceID = 0;
var targetID = 0;

export async function addLayer(layerName, mapLayerGroup) {
    getLayer(layerName)
        .then(data =>  L.geoJSON(data).addTo(mapLayerGroup)) // add layer to layer group
        .catch(err => console.log("Rejected: " + err.message));
}

export async function addPath(mapLayerGroup) {
    getPath()
    .then(data =>  L.geoJSON(data).addTo(mapLayerGroup)) // add layer to layer group
    .catch(err => console.log("Rejected: " + err.message));
}

async function getLayer(layerName) {

    const response = await fetch(baseURL + layerName + respFormat);
    const geoJSON = await response.json();
   
    return geoJSON;
}

async function getNearestVertex(point) {
    var url = `${baseURL}nearest_vertex${respFormat}&viewparams=x:${point.lng};y:${point.lat};`;
    const response = await fetch(url);
    return response.json();
}

async function getPath() {
    var url = `${baseURL}shortest_path${respFormat}&viewparams=source:${sourceID};target:${targetID};`
    const response = await fetch(url);
    return response.json();
}