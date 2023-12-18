export function setMarkerStyles(layer) {
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

        "Picnic Site": L.icon({
            iconUrl: '../../src/frontend/assets/picnic_shelters.svg',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),

        "Clubhouse": L.icon({
            iconUrl: '../../src/frontend/assets/historic_buildings.svg',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),





    };

    layer = L.geoJSON(layer, { // process function for each feature from geoJSON
        pointToLayer: function (feature, latlng) {
            const subtype = feature.properties.SUBTYPE; // get the subtype of the feature from geoJSON file
            
            if (subtype in icons) {
                var a =  L.marker(latlng, { icon: icons[subtype] }); // assigned the icon for a feature 
               a.bindPopup(subtype + " " + feature.id.toString() + " Maintained: " + feature.properties.MAINTAINED);
                
                return a; // assigned the icon for a feature 
            } else {
                console.log("Subtype not found is " + subtype);
                console.log("Subtype not found in icons dict");
            }
        }
    });

    return layer;
}