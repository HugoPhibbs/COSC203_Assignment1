/**
 * Sorts and filters the birds to be shown to a user according to their form input
 *
 * @param birds list of all possible birds that can be displayed to a user
 * @param searchInfo object containing search information from a user
 */
export function sortAndFilterBirds(birds, searchInfo) {
    let searchedBirds = searchBirds(birds, searchInfo.searchString)
    let filteredBirdsByCons = filterBirdsByCons(searchedBirds, searchInfo.conservationStatus)
    let filteredBirdsByWeight = filterBirdsByRange(filteredBirdsByCons, searchInfo.weightRange, (birdJSON) => {
        return birdJSON.size.weight.value
    })
    let filteredBirdsByLength = filterBirdsByRange(filteredBirdsByWeight, searchInfo.lengthRange, (birdJSON) => {
        return birdJSON.size.length.value
    })
    return sortBirds(filteredBirdsByLength, searchInfo.sortBy)
}

/**
 * Filters birds to be displayed to a user according to their conservation status
 *
 * @param birds list of bird as json to be filtered
 * @param conservationStatus string for conservation status to be filtered by
 * @returns list of birds filtered as described
 */
function filterBirdsByCons(birds, conservationStatus) {
    if (["", "Any"].includes(conservationStatus)) {
        return birds
    }
    return birds.filter(birdJSON => {
        return birdJSON.status === conservationStatus
    })
}

/**
 *
 * @param birds array of bird json objects to be filtered
 * @param range array for range of values to be accepted, string values
 * @param key function to provide value of a bird json to be compared to the range
 * @returns array of bird json objects as described
 */
function filterBirdsByRange(birds, range, key) {
    if (range[0] === '') {
        range[0] = Number.NEGATIVE_INFINITY
    }
    if (range[1] === '') {
        range[1] = Number.POSITIVE_INFINITY
    }
    return birds.filter(birdJSON => {return (parseFloat(range[0]) <= key(birdJSON)) && (key(birdJSON) <= parseFloat(range[1]))})
}


/**
 * Searches birds that are displayed to a user based on a search string
 *
 * @param birds list of json objects for all the birds that can be listed to a user
 * @param searchString string for a search string to narrow bird results
 * @returns list of all birds filtered by a search string
 */
function searchBirds(birds, searchString) {
    // TODO handle selection of conservation status
    if (searchString === "") {
        return birds
    }
    return birds.filter(birdJSON => {
        return searchBirdsHelper(searchString, birdJSON)
    })
}

/**
 * Helper function for searching birds, according to a search query (string) from a user
 *
 * @param searchString string for a search query from a user
 * @param birdJSON json object for a particular bird to be filtered or not
 * @returns {boolean} if the bird should be kept on the  page or not
 */
function searchBirdsHelper(searchString, birdJSON) {
    let names = [birdJSON.primary_name, birdJSON.english_name, birdJSON.scientific_name]
    searchString = normalizeString(searchString)
    for (let name of names) {
        if (normalizeString(name).includes(searchString)) {
            return true
        }
    }
    return false
}

/**
 * Normalizes a string, converting it to lowercase in the process
 *
 * Credit to https://javascriptf1.com/snippet/remove-accents-from-a-string-in-javascript
 *
 * @param str String to be normalized
 */
function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/**
 * Sorts a list birds according to user input
 *
 * @param birds list of bird json objects
 * @param sortBy way a user would like the birds to be sorted
 * @returns Array of inputted birds, sorted as specified
 */
function sortBirds(birds, sortBy) {
    switch (sortBy) {
        case "none":
            return birds;
        case "weight":
            return sortBirdsByWeight(birds)
        case "weightRev":
            return sortBirdsByWeight(birds).reverse()
        case "length":
            return sortBirdsByLength(birds)
        case "lengthRev":
            return sortBirdsByLength(birds).reverse()
        default:
            console.log("sortBy parameter is not valid!")
    }
}
/**
 * Sorts a list of birds according to weight
 *
 * @param birds list of bird json objects
 * @returns list as described
 */
function sortBirdsByLength(birds) {
    return birds.sort((a, b) => {return a.size.length.value-b.size.length.value})
}

/**
 * Sorts a list of birds according to weight
 *
 * @param birds list of bird json objects
 * @returns list as described
 */
function sortBirdsByWeight(birds) {
    return birds.sort((a, b) => {return a.size.weight.value-b.size.weight.value})
}

