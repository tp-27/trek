var map; 

function initMap(park) {
    removeChooseParkBtn();

    L.map('map'); // create a new map, associate it with element id 'map'

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { // initialize map with tile layer 
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.setView([51.505, -0.09], 13); // set map view to specified coordinates and zoom level
}


function removeChooseParkBtn() {
    var parkBtn = document.getElementById("park-btn");
    parkBtn.style.display = "none";
}