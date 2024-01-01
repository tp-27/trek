import ClusterGroup from "./clusterGroup.js";
import { pathMarker } from "./clusterGroup.js";
import { mapSettings } from "./mapSettings.js";

export class Map {
    constructor(park) {
        this.map;
        this.park;
        this.sidebar;
        this.searchLayer;
        this.MapSettings = new mapSettings();
        this.clusterGroup = new ClusterGroup(this.MapSettings);
        this.srt_view = [45.80, -78.40];
        this.SW = [45.00, -80.00];
        this.NE = [46.50 , -77.00];
        this.bounds;
    }

    initMapDiv() {
        this.sidebar = L.control.sidebar('sidebar', {
            position: 'left'
        });
        
        this.sidebar.addTo(this.map);

        // this.searchLayer = L.layerGroup();
        // L.marker([45.8372, 78.3791], {
        //     title: "Marker"
        // }).addTo(this.searchLayer);
        
        // console.log(this.searchLayer);
        // this.searchLayer.addTo(this.map);

        // this.map.addControl(new L.Control.Search({
        //     layer: this.searchLayer, //searchLayer is a L.LayerGroup contains searched markers
        //     position: 'topright', 
        // }));

    
    }
    
    showSideBar() {
        console.log(sidebar);
        this.sidebar.open("home");
    }

    initMap(park) {
        this.park = park;
        
        this.map = L.map("map", {
            center: this.srt_view,
            zoom: 9, //set the zoom level
            minZoom: 8,
            maxZoom: 16,
           maxBounds: L.latLngBounds(this.SW, this.NE)
    

        });

        this.initMapDiv(); // show map in container

        this.clusterGroup.mapLayerGroup.addTo(this.map); // add layer group to map
        this.map.setView(this.srt_view, 9); // set map view to specified coordinates and zoom level
        addStartMarkers(this); // add route planning markers
    }

    removeChooseParkBtn() {
        var parkBtn = document.getElementById("park-btn");
        parkBtn.style.display = "none";

        var navBar = document.getElementById("sidebar");
        navBar.style.display = "block";
    }

    showFeatureIcon(feature) {
        this.clusterGroup.showLayer(feature);
    }
    
    hideFeatureIcon(feature) {
        this.clusterGroup.hideLayer(feature);
    }
    
}

export default Map;

async function addStartMarkers(map){
    var canoe_iconS = L.icon({
        iconUrl: "../../src/frontend/assets/Start_canoeS.png",
        iconSize:     [38, 95], // size of the icon
    });
    var canoe_iconE = L.icon({
        iconUrl: "../../src/frontend/assets/Start_canoeE.png",
        iconSize:     [38, 95], // size of the icon
    });

    await map.clusterGroup.addPathMarker(0,{lat:45.844645909959816 , lng:-78.3995533866199},true,canoe_iconS);
    await map.clusterGroup.addPathMarker(1,{lat:45.60012744 ,  lng:-78.77631902 },true,canoe_iconE);
}

