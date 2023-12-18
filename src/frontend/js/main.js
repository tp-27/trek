import { initMap } from './components/map.js';
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
    document.getElementById('park-btn').addEventListener("click", () => {
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
});