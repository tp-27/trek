import ClusterGroup from "./clusterGroup.js";
import { mapSettings } from "./mapSettings.js";

export class Map {
    constructor(park) {
        this.map;
        this.park;
        this.clusterGroup = new ClusterGroup();
        this.sourceID = 38509;
        this.targetID = 5742; //change to a list of target IDs
        this.directionMarkers = [];
        this.srt_view = [45.80, -78.40];
        this.SW = [45.00, -80.00];
        this.NE = [46.50 , -77.00];

        this.bounds;
        this.MapSettings = new mapSettings();
    }

    initMapDiv() {
        var mapDiv = document.getElementById("map");

        mapDiv.style.display = "block"; // display map in map container
        mapDiv.style.height = "100%";
        mapDiv.style.width = "100%";
        // this.removeChooseParkBtn(); // remove select park button

        var sidebar = L.control.sidebar('sidebar').addTo(this.map);
        console.log("Sidebar Added: ", sidebar);
    }

    initMap(park) {
        this.park = park;
        this.initMapDiv(); // show map in container

        
        this.map = L.map("map", {
            center: this.srt_view,
            zoom: 9, //set the zoom level
            minZoom: 8,
            maxZoom: 16,
           maxBounds: L.latLngBounds(this.SW, this.NE)
    

        });

        L.control.bigImage({position: 'bottomright'}).addTo(this.map); // add print control 
        this.clusterGroup.mapLayerGroup.addTo(this.map); // add layer group to map
        this.map.setView(this.srt_view, 9); // set map view to specified coordinates and zoom level
        addStartMarkers(this); // add route planning markers
    }

    showFeatureIcon(feature) {
        this.clusterGroup.showLayer(feature);
    }
    
    hideFeatureIcon(feature) {
        this.clusterGroup.hideLayer(feature);
    }

    // async addDirectionsToSidebar(pdata) {
    //     for(let marker of this.directionMarkers) {
    //         marker.remove();
    //     }
    //     this.directionMarkers = [];

    //     const data = await this.clusterGroup.createDirectionsFromPath(pdata);
        
    //     const outputDiv = document.getElementById('directions-table');
    //     outputDiv.innerHTML = '';
    
    //     data.forEach((item, index) => {
    //         const liElement = document.createElement('div');
    //         liElement.classList.add('table-row');
    
    //         liElement.innerHTML = `
    //             <div class="table-cell ...">${item.name}</div>
    //             <div class="table-cell ...">${item.distance}</div>`;
    
    //         outputDiv.appendChild(liElement);

    //         if(this.MapSettings.dispdir) {
    //             var marker = L.marker([item.pos[1], item.pos[0]]).addTo(this.map);
    //             marker.bindPopup(`${item.name}\nType: ${item.type}`);
    //             this.directionMarkers.push( marker );
    //         }
    //     });
    // }

    // extract route information into dictonary for PDF
    async getRouteInfo() {
        // this.map.clusterGroup.addDirectionsToSidebar(map.clusterGroup.pathDatalist);

        const data = await this.clusterGroup.createDirectionsFromPath(this.clusterGroup.pathDatalist);
        
        const routeInfo = {};
        routeInfo.route = "";
        routeInfo.distance = "";
        data.forEach((item, index) => {
            routeInfo["route"] = routeInfo["route"] + item.name + "\n";
            routeInfo["distances"] = routeInfo["distances"] + "0m" + "\n";
        });

        // console.log(routeInfo);

        
        // routeInfo.route = "A route";
        routeInfo.crew = "Thomas Adam Gryphon";
        // routeInfo.distances = "1000, 231, 500, 564";
        routeInfo.portages = "943, 321, 432, 50";
        routeInfo.totalPortage = "1500m";
        routeInfo.totalCanoe = "5000m";

        return routeInfo;
    }

    // may have to create a user class containing user information
    getTripDetails() {
        const details = {};
        const date = new Date();

        details["park"] = this.park;
        details["year"] = date.getFullYear();
        details["type"] = "canoe";
        details["dates"] = {
            "July 30": "Big Crow Lake",
            "July 31": "Lake La Muir",
            "Aug 1": "Burntroot lake",
            "Aug 2-3": "Big Trout Lake",
            "Aug 4": "Happy Isle Lake",
        }
        details["crew"] = {
            "Boat 1": {
                "Thomas Phan": "Bow",
                "Gryphon Baird": "Midship",
                "Adam Booth": "Stern",
            },

            "Boat 2": {
                "Adam Booth": "Bow",
                "Gryphon Baird": "Midship",
                "Thomas Phan": "Stern",
            },


            "Boat 3": {
                "Adam Booth": "Bow",
                "Gryphon Baird": "Midship",
                "Thomas Phan": "Stern",
            },


            "Boat 4": {
                "Adam Booth": "Bow",
                "Gryphon Baird": "Midship",
                "Thomas Phan": "Stern",
            },
        }

        return details;
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