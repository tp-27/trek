export class mapSettings {
    constructor() {
        //Set defaults
        //this.{setting} = ...

        //Cost Settings
        this.tripleDist = false;
        //Speed Settings
        this.canoeSpeed = 2; //Km/h
        this.portageSpeed = 1; //Km/h
        //Route Settings
        this.dispdir = false;
        this.maxDifficultLevel = 3; //1 = easy only, 2 = easy, intermediate, 3 = easy, intermediate, hard
        this.mapFeatureIcons = ["Designated Camping Site", "Access Point", "Picnic"]
        this.skillLevel = 3; //1 = easy only, 2 = easy, intermediate, 3 = easy, intermediate, hard
        this.maxDailyDist = 12; //Km

        //Tile Setgins

        //Icon / Layer Settings

        //Other Settings
    }

    set canoeSpeed(val) {
        //console.log("New Canoe Speed: ", val);
    }

    set portageSpeed(val) {
        //console.log("New Portage Speed: ", val);
    }

    set skillLevel(val) {
        //console.log("New Skill Level: ", val);
    }

    set maxDailyDist(val) {
        //console.log("New Max Daily Dist: ", val);
    }
    set triplePortageDistance(val) {
        this.tripleDist = val;
        //console.log("Triple Portage Distance: ", val);
    }
    set displayDirectionsOnMap(val) {
        this.dispdir = val;
    }
    get triplePortageDistance(){ return this.tripleDist}

//Setting Options
//Add lists here
}