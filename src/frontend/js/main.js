import { initMap } from './components/map.js';
import { mapSettings, mapSettings } from './components/mapSettings.js';


var mapSettings = new mapSettings();

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
});