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

export async function addLayerWithBoundingBox(layerName, boundBox) {
    var boundParam = "&srsName=CRS&bbox=";
    boundParam += boundBox[0] + ',' + boundBox[1] + ',' + boundBox[2] + ',' + boundBox[3]; // add bounding box coordinates
    console.log(boundParam)

    var resource = baseURL + layerName + respFormat + boundParam

    const response = await fetch(resource);
    const geoJSON = await response.json(); // extract layer with bounding box specifications
    console.log(geoJSON);

    return geoJSON;
}

async function getLayer(layerName) {

    const response = await fetch(baseURL + layerName + respFormat);
    const geoJSON = await response.json();
    console.log(geoJSON);
   
    return geoJSON;
}


export async function getNearestVertex(point) {
    var url = `${baseURL}nearest_vertex${respFormat}&viewparams=x:${point.lng};y:${point.lat};`;
    const response = await fetch(url);
    return response.json();
}

async function getPath() {
    var url = `${baseURL}shortest_path${respFormat}&viewparams=source:${sourceID};target:${targetID};`
    const response = await fetch(url);
    return response.json();
}