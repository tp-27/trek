var map; 



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

    var srt_view = [45.84, -78.40]

    map.setView(srt_view, 14); // set map view to specified coordinates and zoom level
    
  
    var start = L.marker(srt_view).addTo(map);
    var end = L.marker([45.84, -78.10]).addTo(map);

    start.bindPopup("Start.");
    end.bindPopup("End.");


   

    

}   

function removeChooseParkBtn() {
    var parkBtn = document.getElementById("park-btn");
    parkBtn.style.display = "none";
}

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);   