import Map from "../js/components/map.js"
import { modifyPdf, createPdf } from "../js/components/pdf.js";

const parks = ["Algonquin", "Kawartha", "Killarney", "Sleeping Giant", "Temagami"];
var day = 1

window.addEventListener('DOMContentLoaded', function() {
    var map = new Map()
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
        
        const newDayDiv = createDayDiv(event.target.value, map); // create a new day in side bar 
        const addDayDiv = document.querySelector(".day");
        const sideBarDiv = document.getElementById("home");
      
        sideBarDiv.insertBefore(newDayDiv, addDayDiv);

        if (day === 1) {
            console.log('day 1')
            map.addStartMarkers(); // add start markers to map
            day += 1
        } else {
            console.log('day ' + day)
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

function createDayDiv (date, mapObj) {
    const dayDiv = document.createElement('div');
    const dayDivBody = document.createElement('div');
    const startDateHeader = document.createElement("p");
    const selectBtnContainer = document.createElement("div");
    const selectStartDiv = document.createElement("div");
    const selectStartSpan = document.createElement("span");
    const selectStartIcon = document.createElement("img");
    const selectStartText = document.createElement("p");

    const selectEndSpan = document.createElement("span");
    const selectEndIcon = document.createElement("img");
    const selectEndText = document.createElement("p");

    const selectEndDiv = document.createElement("div");
    const deleteDayBtn = document.createElement("button");
    const confirmDayBtn = document.createElement("button");
    const editDayBtn = document.createElement("button");

    dayDiv.classList.add("newDay");
    dayDivBody.classList.add("newDayBody"); 

    startDateHeader.classList.add("day-header")
    startDateHeader.innerText = date;
    startDateHeader.style.fontSize = "18px";
    startDateHeader.style.fontWeight = "700";
    startDateHeader.style.color = "black";
    editDayBtn.innerText = "Edit"
    editDayBtn.classList.add("edit-btn")
    editDayBtn.classList.add("inactive")

    
    selectStartDiv.classList.add("selectBtns");
    selectStartIcon.src = "../../src/frontend/assets/start-pin.svg"; 
    selectStartSpan.classList.add("selectBtnSpan");
    selectStartSpan.id = "start";
    selectStartText.innerText = "Drag icon to select start";

    selectStartSpan.appendChild(selectStartIcon);
    selectStartSpan.appendChild(selectStartText);
    selectStartDiv.appendChild(selectStartSpan);

 
    selectEndDiv.classList.add("selectBtns");
    selectEndIcon.src = "../../src/frontend/assets/end-pin.svg"; 
    selectEndSpan.classList.add("selectBtnSpan");
    selectEndSpan.id = "end";
    selectEndText.innerText = "Drag icon to select end";
    selectEndSpan.appendChild(selectEndIcon);
    selectEndSpan.appendChild(selectEndText);
    selectEndDiv.appendChild(selectEndSpan);

    selectBtnContainer.classList.add("selectBtnContainer"); 
    selectBtnContainer.id = 'day-' + day

    // if (day === 1) {
    //     selectBtnContainer.append(selectStartDiv);
    // }
    
    selectBtnContainer.append(selectStartDiv);
    selectBtnContainer.append(selectEndDiv);
    console.log(selectBtnContainer)

    deleteDayBtn.classList.add("deleteDayBtn");
    deleteDayBtn.innerText = "Delete day";
    deleteDayBtn.addEventListener("click", () => {
        dayDiv.remove(); // remove current day on delete
    });

    confirmDayBtn.classList.add("confirmDayBtn");
    confirmDayBtn.innerText = "Finish day";
    confirmDayBtn.addEventListener("click", () => {
        deleteDayBtn.remove()
        confirmDayBtn.remove()
        startDateHeader.appendChild(editDayBtn)
    })

    dayDivBody.append(selectBtnContainer); // add the select btn container
    dayDiv.appendChild(startDateHeader); // add the start date
    dayDiv.appendChild(dayDivBody); // append select and delete buttons
    dayDiv.append(deleteDayBtn); // add the delete btn
    dayDiv.appendChild(confirmDayBtn); // append confirm day button

    return dayDiv;
}