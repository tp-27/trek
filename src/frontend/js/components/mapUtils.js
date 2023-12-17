import { setMarkerStyles } from './mapStyles.js';

const baseURL = "http://52.15.34.182:8080/geoserver/wfs?service=wfs&version=2.0.0&request=getfeature&typename="; //Geographic Web File Service

export async function addLayer(layerName, mapLayerGroup) {
    getLayer(layerName)
        .then((data) =>  {
            const layer = setMarkerStyles(data); // customize layer icons 
            layer.addTo(mapLayerGroup); // add layer to layer group

            // L.geoJSON(data).addTo(mapLayerGroup);


        })
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
    var respFormat = "&outputFormat=application/json";

    const response = await fetch(baseURL + layerName + respFormat);
    const geoJSON = await response.json();
    console.log(geoJSON);
   
    return geoJSON;
}

async function getNearestVertex(point) {
    var url = `${baseURL}nearest_vertex&outputformat=application/json&viewparams=x:${point.lng};y:${point.lat};`;
    const response = await fetch(url);
    return response.json();
}
