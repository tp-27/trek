import Map from "../js/components/map.js"

var map = new Map();

window.addEventListener('DOMContentLoaded', function() {
    const parkDefault = "algonquin";
    map.initMap(parkDefault);

    // document.getElementById('park-btn').addEventListener("click", () => { // initialize map on click of button
    //     const park = 'algonquin';
    //     map.initMap(park);
    // });

    //Settings Functions
    //document.getElementById('{SettingName}').addEventListener("click", () => {
    //      // Get Value
    //      mapSettings.set{SettingName}();
    //      mapSettings.setLocalStorage({SettingName},{Value})
    //});

    this.document.getElementById("canoespeed-btn").addEventListener("click", () => {
        map.MapSettings.canoeSpeed = this.document.getElementById("canoespeed-in").value;
    });

    this.document.getElementById("portagespeed-btn").addEventListener("click", () => {
        map.MapSettings.portageSpeed = this.document.getElementById("portagespeed-in").value;
    });
  
    var iconCheckboxes = document.querySelectorAll("input[type=checkbox][name=icons]");
    var checkboxSettings = []

    iconCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', function() {
            if (checkbox.checked) {
                console.log(checkbox.value);
                map.showFeatureIcon(checkbox.value); 
            } else {
                map.hideFeatureIcon(checkbox.value);
            }
            // updateFeatureIconSettings();
            console.log(checkbox.value);
        })
    });

    this.document.getElementById("maxdist-btn").addEventListener("click", () => {
        map.MapSettings.portageSpeed = this.document.getElementById("maxdist-in").value;
    });

    this.document.getElementById("beginner-btn").addEventListener("click", () => {
        map.MapSettings.maxDifficultyLevel = 1
        map.MapSettings.canoeSpeed = this.document.getElementById("canoespeed-in").value = 2.4;
        map.MapSettings.portageSpeed = this.document.getElementById("portagespeed-in").value = 1;
        map.MapSettings.portageSpeed = this.document.getElementById("maxdist-in").value = 10;
    });

    this.document.getElementById("intermediate-btn").addEventListener("click", () => {
        map.MapSettings.maxDifficultyLevel = 1
        map.MapSettings.canoeSpeed = this.document.getElementById("canoespeed-in").value = 4;
        map.MapSettings.portageSpeed = this.document.getElementById("portagespeed-in").value = 1.2;
        map.MapSettings.portageSpeed = this.document.getElementById("maxdist-in").value = 15;
    });

    this.document.getElementById("expert-btn").addEventListener("click", () => {
        map.MapSettings.maxDifficultyLevel = 1
        map.MapSettings.canoeSpeed = this.document.getElementById("canoespeed-in").value = 6;
        map.MapSettings.portageSpeed = this.document.getElementById("portagespeed-in").value = 1.5;
        map.MapSettings.portageSpeed = this.document.getElementById("maxdist-in").value = 20;
    });

    this.document.getElementById("tpd-btn").addEventListener("click", () => {
        var value = !map.MapSettings.triplePortageDistance;
        map.MapSettings.triplePortageDistance = value;
        this.document.getElementById("tpd-btn").textContent = "Triple Portage Dist: " + value;
    });
    this.document.getElementById("directions-checkbox").addEventListener("change", (event) => {
        map.MapSettings.displayDirectionsOnMap = event.target.checked;
        map.addDirectionsToSidebar(map.clusterGroup.pathData);
    });
});
