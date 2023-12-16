var map; 
var srt_view = [45.84, -78.40]
console.log("check");

function initMap(park) {
    
    var mapDiv = document.getElementById("map");

    mapDiv.style.display = "block";
    mapDiv.style.height = "600px";
    mapDiv.style.width = "90%";
    removeChooseParkBtn(); // remove select park button 

    var map = L.map("map", {
        center: [-78.40, 45.84],
        zoom: 9 //set the zoom level
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // initialize map with tile layer 
    maxZoom: 9,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    map.setView(srt_view, 20); // set map view to specified coordinates and zoom level
    
    markers(map);
}   



function markers(map){
    var canoe_icon = L.icon({
        iconUrl: "../../src/frontend/assets/Start_canoe.png",
        //shadowUrl: "../../src/frontend/assets/leaf-shadow.png",
    
        iconSize:     [38, 95], // size of the icon
       // shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
       // shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

  
    var start = L.marker((srt_view), {draggable: true,
        autoPan: true, icon : canoe_icon}).addTo(map);

        var end = L.marker([45.84, -78.10], {draggable: true,
            autoPan: true, icon: canoe_icon}).addTo(map);
        
        start.bindPopup("Start" +  start.getLatLng());
        end.bindPopup("End." + end.getLatLng());
    
            start.on('dragend', function(event) {
                var S_latlng = event.target.getLatLng();
                console.log("START: ", S_latlng.lat, S_latlng.lng)
                start.bindPopup("Start" +  start.getLatLng());
              });
    
    
            end.on('dragend', function(event) {
                var E_latlng = event.target.getLatLng();
                console.log("END: ", E_latlng.lat, E_latlng.lng)
                end.bindPopup("End." + end.getLatLng());
              });



              
}


function removeChooseParkBtn() {
    var parkBtn = document.getElementById("park-btn");
    parkBtn.style.display = "none";
}





