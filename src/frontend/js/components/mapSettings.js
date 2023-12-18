export class mapSettings {
    constructor() {
        //Set defaults
        //this.{setting} = ...

        //Cost Settings
        this.triplePortageDistance = false;
        //Speed Settings
        this.canoeSpeed = 4; //Km/h
        this.portageSpeed = 2; //Km/h
        //Route Settings
        this.maxDifficultLevel = 3; //1 = easy only, 2 = easy, intermediate, 3 = easy, intermediate, hard
        this.mapFeatureIcons = ["Designated Camping Site", "Access Point", "Picnic"]

        //Tile Setgins

        //Icon / Layer Settings

        //Other Settings
    }

    set canoeSpeed(val) {
        console.log("New Canoe Speed: ", val);
    }

    set portageSpeed(val) {
        console.log("New Portage Speed: ", val);
    }


}

//Setting Options
//Add lists here