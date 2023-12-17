var baseURL = "http://52.15.34.182:8080/geoserver/wfs?service=wfs&version=2.0.0&request=getfeature&typename="; //Geographic Web File Service

export function getLayer(layerName) {
    fetch(baseURL + layerName)
    .then(response => {
        if(!response.ok) {
            throw new Error('Error: Invalid Response');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}