var map; 

function initMap(park) {
    var mapDiv = document.getElementById("map");

    mapDiv.style.display = "block";
    mapDiv.style.height = "600px";
    mapDiv.style.width = "90%";
    removeChooseParkBtn(); // remove select park button 

    var map = L.map("map", {
        center: [-1.2836622060674874, 36.822524070739746],
        zoom: 16 //set the zoom level
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // initialize map with tile layer 
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}   

function removeChooseParkBtn() {
    var parkBtn = document.getElementById("park-btn");
    parkBtn.style.display = "none";
}