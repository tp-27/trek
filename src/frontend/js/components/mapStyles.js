export function setMarkerStyles(subtype, geoJSON) {
    const icons =  { // icon styles for various features
        "Designated Camping Site": L.icon({
            iconUrl: '../../src/frontend/assets/tent.svg',
            iconSize: [20, 20],
            iconAnchor: [10, 20],
            popupAnchor: [0, -20],
        }),
        
        "Access Point": L.icon({
            iconUrl: '../../src/frontend/assets/access.svg',
            iconSize: [20, 20],
            iconAnchor: [10, 20],
            popupAnchor: [0, -20],
        }),
    
        "Picnic Site": L.icon({
            iconUrl: '../../src/frontend/assets/picnic_shelters.svg',
            iconSize: [20, 20],
            iconAnchor: [10, 20],
            popupAnchor: [0, -20],
        }),
    
        "Clubhouse": L.icon({
            iconUrl: '../../src/frontend/assets/historic_buildings.svg',
            iconSize: [20, 20],
            iconAnchor: [10, 20],
            popupAnchor: [0, -20],
        }),
    };

    const layer = L.geoJSON(geoJSON, { // process function for each feature from geoJSON
        pointToLayer: function (feature, latlng) {
            // const subtype = feature.properties.SUBTYPE; // get the subtype of the feature from geoJSON file
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

export function setPathStyles(geoJSON, isRoute) {
    //isRoute -> change styling based on if path is a route or part of main trail display
    //Types:
    //  LakeRoute (Only exists if isRoute == true because apt_seg does not contain lakeroutes)
    //  canoeRoute
    //  portageRoute (could be a portageRoute or a trail)
    var styledFeature = L.geoJSON(geoJSON);
    /*
     console.log("PathStyle GeoJSON: ", styledFeature);
    for(var fid in styledFeature._layers) {
        var feat = styledFeature._layers
        if(feat[fid].feature.properties == 'LakeRoute') {
            feat.setStyle({
                //set custom style for lakeRoute
            });
        } else if (feat[fid].feature.properties == 'canoeRoute') {
            feat.setStyle({
                //set custom style for canoeRoute
            });
        } else if(feat[fid].feature.properties == 'portageRoute') {
            feat.setStyle({
                //set custom style for portageRoute
            });
        } else { //Base Style
            feat.setStyle({
                //set custom style for anything else
            });
        }
    }*/
   
    return styledFeature;
}