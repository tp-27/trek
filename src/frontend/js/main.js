import Map from "../js/components/map.js"
import Trip from "../js/components/trip.js"
import { createDayDiv } from "../js/components/utils.js"
import { modifyPdf, createPdf } from "../js/components/pdf.js";

const parks = ["Algonquin", "Kawartha", "Killarney", "Sleeping Giant", "Temagami"];
var day = 1


const assets_url = window.location.href.replace(/(frontend\/).*/, `$1assets/`); // Get url of api directory

console.log(assets_url)
window.addEventListener('DOMContentLoaded', function() {
    var map = new Map()
    var trip = new Trip()

    map.initMap('algonquin')

    const dropdown = document.querySelector(".park-dropdown");
    const select = dropdown.querySelector(".dropdown-header");
    const menu = dropdown.querySelector(".menu");
    const options = dropdown.querySelectorAll(".menu li");
    const selected = dropdown.querySelector(".selected");
    const startBtn = document.getElementById('startBtn')

    startBtn.addEventListener('click', () => {
        map.showSideBar(); // show sidebar  
    }) 

    var dateModal = document.getElementById("dateModal");
    var closeModal = document.getElementsByClassName("close")[0];

    closeModal.onclick = function() {
        dateModal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == dateModal) {
          dateModal.style.display = "none";
        }
    }

    var dateInput = document.getElementById("dateStart");
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = String(date.getFullYear());

    date = yyyy + '-' + mm + '-' + dd;
    var maxDate = (yyyy + 5) + '-' + mm + '-' + dd;
    dateInput.value = date;
    dateInput.min = date;
    dateInput.max = maxDate;

    dateInput.addEventListener("change", (event) => { // when user selects start date
        dateModal.style.display = "none"; // close the modal
        
        const newDayDiv = createDayDiv(trip, event.target.value, map); // create a new day in side bar 
        const addDayDiv = document.querySelector(".day");
        const sideBarDiv = document.getElementById("home");
      
        sideBarDiv.insertBefore(newDayDiv, addDayDiv);

        if (day === 1) {
            map.addStartMarkers(); // add start markers to map
            day += 1
        } else {
            map.addNextMarker(day)
            day += 1
        }
        

    })

    this.document.getElementById("addDay").addEventListener("click", function () {
        dateModal.style.display = "block";
    })

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;
            select.classList.remove('select-clicked');
            menu.classList.remove('menu-open');
            options.forEach(option => {
                option.classList.remove('active');
            });
            option.classList.add('active');
        })
    })

    this.document.getElementById("pdf").addEventListener("click", async () => {
        try {
            createPdf(map.getTripDetails());
        } catch (error) {
            console.error("Failed to get route for pdf: ", error);
        }
    })

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

    this.document.getElementById("sidebar").addEventListener("mouseover", (event) => {
        map.disableMapInteraction();
    },false);

    this.document.getElementById("sidebar").addEventListener("mouseleave", (event) => {
        map.enableMapInteraction();
    },false);  
});
