// Loading conservation status data
const CONS_STATUS_URL = 'https://hugophibbs.github.io/COSC203_Assignment1/resources/conservation-colours.json'

fetch(CONS_STATUS_URL)
    .then(async (response) => {
        const consJSON = await response.json()
        addConsDropdownOptions(consJSON)
        addConsColoursGuide(conservationJSON)
        console.log(consJSON)
    })
    .catch((error) => console.log(error))

// Handling conservation status data

/**
 * Adds conservation status dropdown that a user can select from
 *
 * @param conservationJSON JSON object with conservation key value pairs
 */
function addConsDropdownOptions(conservationJSON) {
    const consDropdown = document.getElementById("conservation-dropdown")
    console.log("here")
    for (let consStatus in conservationJSON) {
        let option = document.createElement("option")
        let text = document.createTextNode(consStatus);
        option.appendChild(text);
        option.setAttribute.value = "constStatus";
        consDropdown.appendChild(option);
    }
}

function addConsColoursGuide(conservationJSON) {
    // TODO
}

// Getting birds info
const BIRDS_URL = 'https://hugophibbs.github.io/COSC203_Assignment1/resources/data/nzbird.json'
let birds = null;

fetch(BIRDS_URL)
    .then(async (response) => {
        birds = await response.json()
        addBirdsToMain(birds)
    })
    .catch((error) => console.log(error))

/**
 * Adds a list of birds to the page
 *
 * @param birds array containing json objects describing which birds to display
 */
function addBirdsToMain(birds) {
    // TODO
}

/**
 * Creates an html info box for a particular that is to be added to the page
 * then adds it using DOM
 *
 * @param birdJSON json object describing a bird to be added
 */
function createBirdInfoBox(birdJSON) {
    // TODO
    let infoCard = document.createElement("div")
    infoCard.className = "bird-info-card"
    let birdImg = document.createElement("img")
    birdImg.setAttribute("class", `bird-image`)
    birdImg.setAttribute("alt", `Photo of ${birdJSON.english_name}`)

    let factSheet = document.createElement("div")
    factSheet.setAttribute("class", "bird-fact-sheet")

    let description = document.createElement("p")
    description.setAttribute("class", "description")

    let photoCredit = document.createElement("p")
    description.setAttribute("class", "photo-credit")

}

/**
 * Finds the name of the jpeg image for a particular bird to be displayed
 * @param birdEnglishName
 */
function findBirdImg(birdEnglishName) {
    birdEnglishName = birdEnglishName.toLowerCase()
}

// Adding birds to main

// Handling search form

/**
 * Gets the search input from a user
 *
 * @returns object containing keys for a searchString, conservationStatus and sortBy as inputted by a user
 */
function getSearchInfo() {
    const searchString = document.getElementById("search box").value
    const conservationStatus = document.getElementById("conservation-dropdown").value
    const sortBy = document.getElementById("sortBy-dropdown").value
    return {"searchString": searchString, "conservationStatus": conservationStatus, "sortBy": conservationStatus}
}

/**
 * Handles event when a search button is requested from a user
 */
function searchButtonPressed() {
    // TODO handle case where birds json has not been loaded
    if (birds === null) {
        console.log("birds haven't been loaded yet!")
        return
    }
    const searchInfo = getSearchInfo()
    const searchString = searchInfo.searchString
    if (searchString === "") {
        return
    }
    let birdsFiltered = birds.filter((birdJSON) => {
        filterBird(searchString, birdJSON)
    })

    // TODO order birds
}

/**
 * Filter function for which birds to show, according to a search query (string) from a user
 *
 * @param searchString string for a search query from a user
 * @param birdJSON json object for a particular bird to be filtered or not
 * @returns {boolean} if the bird should be kept on the  page or not
 */
function filterBird(searchString, birdJSON) {
    let names = [birdJSON.primary_name, birdJSON.english_name, birdJSON.scientific_name]
    for (let name of names) {
        // TODO sort out normalisation
        if (name.toLowerCase().includes(searchString.toLowerCase())) {
            return true
        }
    }
    return false
}

/**
 * Changes the list of birds that are displayed to a user, after a user has entered data into the search form
 *
 * @param searchCriteria object containing parts of a search from a user, eg search string, ordering, conservation status etc.
 */
function changeBirdsDisplayed(searchCriteria) {
    // TODO
}

