const baseURL = "http://52.15.34.182:8080/geoserver/wfs?service=wfs&version=2.0.0&request=getfeature&typename="; //Geographic Web File Service

export async function addLayer (layerName, mapLayerGroup) {
    getLayer(layerName)
        .then(data =>  L.geoJSON(data).addTo(mapLayerGroup)) // add layer to layer group
        .catch(err => console.log("Rejected: " + err.message));
}

async function getLayer(layerName) {
    var respFormat = "&outputFormat=application/json";

    const response = await fetch(baseURL + layerName + respFormat);
    const geoJSON = await response.json();
   
    return geoJSON;
}

async function getNearestVertex(point) {
    var url = `${baseURL}nearest_vertex&outputformat=application/json&viewparams=x:${point.lng};y:${point.lat};`;
    const response = await fetch(url);
    return response.json();
}