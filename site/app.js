// Useful constants
const RESOURCES_URL = 'https://hugophibbs.github.io/COSC203_Assignment1/resources/'
import {sortAndFilterBirds} from "./support.js";

// Loading conservation status data
const CONS_STATUS_URL = `${RESOURCES_URL}conservation-colours.json`

/** JSON object for the hex colour codes for each conservation status*/
let consJSON;

/**
 * Fetches the conservation status json, practically the starting function of this app
 *
 * As loading birds relies on loading the conservation status json
 */
function fetchConsStatus() {
    fetch(CONS_STATUS_URL)
        .then(async (response) => {
            consJSON = await response.json()
            addConsDropdownOptions(consJSON)
            addConsColoursGuide(consJSON)
            fetchBirds()
        })
        .catch(error => console.log(error))
}

/**
 * Adds conservation status dropdown that a user can select from
 *
 * @param conservationJSON JSON object with conservation key value pairs
 */
function addConsDropdownOptions(conservationJSON) {
    const consDropdown = document.getElementById("conservation-dropdown")
    for (let consStatus in conservationJSON) {
        let option = document.createElement("option")
        option.text = consStatus
        option.setAttribute.value = consStatus;
        consDropdown.appendChild(option);
    }
}

/**
 * Adds a conservation status colour guide to the webpage
 *
 * @param conservationJSON json object containing keys for conservation status, and keys for corresponding conservation colours.
 */
function addConsColoursGuide(conservationJSON) {
    const consList = document.getElementById("conservation-colour-list")
    for (let cons in conservationJSON) {
        const guideDiv = document.createElement("div")
        guideDiv.setAttribute("class", "cons-guide-entry")
        const statusP = document.createElement("p")
        statusP.textContent = cons
        const statusCirc = document.createElement("div")
        statusCirc.setAttribute("class", "cons-colour-circle")
        statusCirc.setAttribute("style", `background-color: ${consJSON[cons]};`)
        guideDiv.appendChild(statusCirc)
        guideDiv.appendChild(statusP)
        consList.appendChild(guideDiv)
    }
}

// Getting birds info
const BIRDS_URL = `${RESOURCES_URL}data/nzbird.json`

/**
 * Fetches a json file containing data on birds to be displayed, then passes on flow to handlers.
 */
function fetchBirds() {
    fetch(BIRDS_URL)
        .then(async (response) => {
            birdsLoaded(await response.json())
        })
        .catch((error) => console.log(error))
}

/**
 * Handles when array of birds objects has been loaded
 *
 * @param birds array of bird json objects
 */
function birdsLoaded(birds) {
    birds = birds.sort((a, b) => 0.5-Math.random())
    addBirdsToMain(birds)
    addListeners(birds)
}

/**
 * Adds listeners to components once birds have been loaded
 *
 * @param birds list of bird objects loaded
 */
function addListeners(birds) {
    document.getElementById("search-button").addEventListener("click", (eventData) => {
        searchButtonPressed(eventData, birds)
    })
}

/**
 * Adds a list of birds to the page
 *
 * Clears main before adding birds
 *
 * @param birds array containing json objects describing which birds to display
 */
function addBirdsToMain(birds) {
    document.getElementById("main").innerHTML = ''
    for (let birdJSON of birds) {
        createBirdInfoBox(birdJSON)
    }
    document.getElementById("search-button").disabled = false;
}

/**
 * Creates an html info box for a particular that is to be added to the page
 * then adds it using DOM
 *
 * @param birdJSON json object describing a bird to be added
 * @returns null
 */
function createBirdInfoBox(birdJSON) {
    let infoCard = document.createElement("div")
    infoCard.className = "bird-info-card"
    infoCard.appendChild(document.createElement("div"))

    let factSheet = document.createElement("div")
    factSheet.setAttribute("class", "bird-fact-sheet")

    let photoCredit = document.createElement("p")
    photoCredit.setAttribute("class", "photo-credit")
    photoCredit.textContent = `Photo Credit: ${birdJSON.photo.credit}`

    const innerDiv = infoCard.children[0]
    innerDiv.setAttribute("class", "inner_div")
    innerDiv.style.borderColor = consJSON[birdJSON.status]

    innerDiv.appendChild(createBirdImageDiv(birdJSON))
    innerDiv.appendChild(factSheet)
    factSheet.appendChild(createBirdDescription(birdJSON))
    factSheet.appendChild(photoCredit)

    document.getElementById("main").appendChild(infoCard)
}

/**
 * Creates an div element that contains a photo of a particular bird, along with a title
 *
 * @param birdJSON object describing a bird
 * @returns {HTMLDivElement} as described
 */
function createBirdImageDiv(birdJSON) {
    let birdImgDiv = document.createElement("div")
    birdImgDiv.setAttribute("class", "bird-image-div")

    let birdImg = document.createElement("img")
    birdImg.setAttribute("class", `bird-image`)
    birdImg.setAttribute("alt", `Photo of ${birdJSON.english_name}`)
    birdImg.setAttribute("src", `${RESOURCES_URL}${birdJSON.photo.source}`)

    let birdTitle = document.createElement("h2")
    birdTitle.setAttribute("class", "bird-title")
    birdTitle.textContent = birdJSON.primary_name

    birdImgDiv.appendChild(birdImg)
    birdImgDiv.appendChild(birdTitle)

    return birdImgDiv
}

/**
 * Creates a description for a particular bird,
 *
 * @param birdJSON object describing a bird
 * @returns {HTMLParagraphElement} describing a bird
 */
function createBirdDescription(birdJSON) {
    let description = document.createElement("p")
    description.setAttribute("class", "description")

    description.innerHTML = `
        <h3>${birdJSON.english_name}</h3>
        <b>Scientific Name: </b>${birdJSON.scientific_name} <br>
        <b>Family: </b>${birdJSON.family} <br>
        <b>Status: </b>${birdJSON.status} <br>
        <b>Length: </b>${birdJSON.size.length.value}${birdJSON.size.length.units} <br>
        <b>Weight: </b>${birdJSON.size.weight.value}${birdJSON.size.weight.units} <br>
        `
    return description
}

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
    const weightRange = [document.getElementById("min-weight").value, document.getElementById("max-weight").value]
    const lengthRange = [document.getElementById("min-length").value, document.getElementById("max-length").value]
    return {
        "searchString": searchString,
        "conservationStatus": conservationStatus,
        "sortBy": sortBy,
        "weightRange": weightRange,
        "lengthRange": lengthRange
    }
}

/**
 * Handles event when a search button is requested from a user
 */
function searchButtonPressed(eventData, birds) {
    document.getElementById("search-button").disabled = true;
    if (birds === null) {
        console.log("birds haven't been loaded yet!")
        return
    }
    addBirdsToMain(sortAndFilterBirds(birds, getSearchInfo()))
    document.getElementById("search-button").disabled = false;
    eventData.preventDefault();
}


// Actually running
function start() {
    fetchConsStatus()
}

start()