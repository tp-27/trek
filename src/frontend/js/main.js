import { initMap } from './components/map.js';

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
});