export function setMarkerStyles(layer) {
    const icons =  { // icon styles for various features
        "Designated Camping Site": L.icon({
            iconUrl: '../../src/frontend/assets/tent.svg',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        
        // "Access Point": L.icon({
        //     iconUrl: '../../src/frontend/assets/access.svg',
        //     iconSize: [32, 32],
        //     iconAnchor: [16, 32],
        //     popupAnchor: [0, -32],
        // }),
    };

    layer = L.geoJSON(layer, { // process functino for each feature from geoJSON
        pointToLayer: function (feature, latlng) {
            const subtype = feature.properties.SUBTYPE; // get the subtype of the feature from geoJSON file
            console.log(subtype);
            return L.marker(latlng, { icon: icons[subtype] }); // assigned the icon for a feature 
        }
    });

    console.log(layer);

    return layer;
}