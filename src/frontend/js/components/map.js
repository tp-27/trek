var map; 

function initMap(park) {
    var mapDiv = document.getElementById("map");

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

    map.setView([45.84, -78.40], 10); // set map view to specified coordinates and zoom level
}   

function removeChooseParkBtn() {
    var parkBtn = document.getElementById("park-btn");
    parkBtn.style.display = "none";
}