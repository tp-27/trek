import Map from "../js/components/map.js"

const parks = ["Algonquin", "Kawartha", "Killarney", "Sleeping Giant", "Temagami"];

var map = new Map();

window.addEventListener('DOMContentLoaded', function() {
    const parkDefault = "algonquin";
    map.initMap(parkDefault);

    const dropdown = document.querySelector(".park-dropdown");

    const select = dropdown.querySelector(".dropdown-header");
    const menu = dropdown.querySelector(".menu");
    const options = dropdown.querySelectorAll(".menu li");
    const selected = dropdown.querySelector(".selected");

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
        map.clusterGroup.addDirectionsToSidebar(map.clusterGroup.pathDatalist);
    });

    this.document.getElementById("startBtn").addEventListener("click", () => {
        map.showSideBar(); // show sidebar 
    })
  

    var dateModal = document.getElementById("dateModal");
    var addDay = document.querySelector(".day");
    var closeModal = document.getElementsByClassName("close")[0];
    
    addDay.onclick = function() {
        dateModal.style.display = "block";
    }

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
        
        const newDayDiv = createDayDiv(event.target.value); // create a new day in side bar 
        const addDayDiv = document.querySelector(".day");
        const sideBarDiv = document.getElementById("home");
      

        sideBarDiv.insertBefore(newDayDiv, addDayDiv);
    })
});


function createDayDiv (date) {
    const dayDiv = document.createElement('div');
    const dayDivBody = document.createElement('div');
    const startDateHeader = document.createElement("p");
    const selectBtnContainer = document.createElement("div");
    const selectStartDiv = document.createElement("div");
    const selectEndDiv = document.createElement("div");
    const deleteDayBtn = document.createElement("button");
    const confirmDayBtn = document.createElement("button");

    dayDiv.classList.add("newDay");
    dayDivBody.classList.add("newDayBody"); 

    startDateHeader.innerText = date;
    startDateHeader.style.fontSize = "18px";
    startDateHeader.style.fontWeight = "700";
    startDateHeader.style.color = "black";
    
    selectStartDiv.classList.add("selectBtns");
    selectStartDiv.innerText = "Start";
    selectStartDiv.addEventListener("click", () => {
        
    })


    selectEndDiv.classList.add("selectBtns");
    selectEndDiv.innerText = "End";

    selectBtnContainer.classList.add("selectBtnContainer"); 
    selectBtnContainer.append(selectStartDiv);
    selectBtnContainer.append(selectEndDiv);

    deleteDayBtn.classList.add("deleteDayBtn");
    deleteDayBtn.innerText = "x";
    deleteDayBtn.addEventListener("click", () => {
        dayDiv.remove(); // remove current day on delete
    });

    confirmDayBtn.classList.add("confirmDayBtn");
    confirmDayBtn.innerText = "Finish day";

    dayDivBody.append(selectBtnContainer); // add the select btn container
    dayDivBody.append(deleteDayBtn); // add the delete btn

    dayDiv.appendChild(startDateHeader); // add the start date
    dayDiv.appendChild(dayDivBody); // append select and delete buttons
    dayDiv.appendChild(confirmDayBtn); // append confirm day button

    return dayDiv;
}