import { initMap, showFeatureIcon, hideFeatureIcon  } from './components/map.js';
import { mapSettings as MapSettings } from './components/mapSettings.js';

var mapSettings = new MapSettings();

// scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) { // is entry intersecting viewport?
            entry.target.classList.add('show'); // make entry visible
        } 
    });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el)); // observe all hidden elements

window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('park-btn').addEventListener("click", () => { // initialize map on click of button
        initMap();
    });

    //Settings Functions
    //document.getElementById('{SettingName}').addEventListener("click", () => {
    //      // Get Value
    //      mapSettings.set{SettingName}();
    //      mapSettings.setLocalStorage({SettingName},{Value})
    //});

    this.document.getElementById("canoespeed-btn").addEventListener("click", () => {
        mapSettings.canoeSpeed = this.document.getElementById("canoespeed-in").value;
    });

    this.document.getElementById("portagespeed-btn").addEventListener("click", () => {
        mapSettings.portageSpeed = this.document.getElementById("portagespeed-in").value;
    });
  
    var iconCheckboxes = document.querySelectorAll("input[type=checkbox][name=icons]");
    var checkboxSettings = []

    iconCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', function() {
            if (checkbox.checked) {
                showFeatureIcon(checkbox.value); 
            } else {
                hideFeatureIcon(checkbox.value);
            }
            updateFeatureIconSettings();
            console.log(checkbox.value);
        })
    });
});

    this.document.getElementById("maxdist-btn").addEventListener("click", () => {
        mapSettings.portageSpeed = this.document.getElementById("maxdist-in").value;
    });

    this.document.getElementById("beginner-btn").addEventListener("click", () => {
        mapSettings.maxDifficultyLevel = 1
        mapSettings.canoeSpeed = this.document.getElementById("canoespeed-in").value = 2.4;
        mapSettings.portageSpeed = this.document.getElementById("portagespeed-in").value = 1;
        mapSettings.portageSpeed = this.document.getElementById("maxdist-in").value = 10;
    });

    this.document.getElementById("intermediate-btn").addEventListener("click", () => {
        mapSettings.maxDifficultyLevel = 1
        mapSettings.canoeSpeed = this.document.getElementById("canoespeed-in").value = 4;
        mapSettings.portageSpeed = this.document.getElementById("portagespeed-in").value = 1.2;
        mapSettings.portageSpeed = this.document.getElementById("maxdist-in").value = 15;
    });

    this.document.getElementById("expert-btn").addEventListener("click", () => {
        mapSettings.maxDifficultyLevel = 1
        mapSettings.canoeSpeed = this.document.getElementById("canoespeed-in").value = 6;
        mapSettings.portageSpeed = this.document.getElementById("portagespeed-in").value = 1.5;
        mapSettings.portageSpeed = this.document.getElementById("maxdist-in").value = 20;
    });

    this.document.getElementById("tpd-btn").addEventListener("click", () => {
        var value = !mapSettings.triplePortageDistance;
        mapSettings.triplePortageDistance = value;
        this.document.getElementById("tpd-btn").textContent = "Triple Portage Dist: " + value;
    });
});
