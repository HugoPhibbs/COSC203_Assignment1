fetch('conservation-colours.json').then((response) => {
    console.log(response)
})

function addConsDropdownOptions(conservationJSON) {
    const consDropdown = document.getElementById("conservation-dropdown")
    console.log("here")
    for (let consStatus in conservationJSON){
        let option = document.createElement("option")
        let text = document.createTextNode(conservationJSON[consStatus]);
        option.appendChild(text);
        option.setAttribute.value = "constStatus";
        consDropdown.appendChild(option);
    }
}
function getSearchInfo() {
    const name = document.getElementById("search box").value
    const conservationStatus = document.getElementById("conservation-dropdown").value
    const sortBy= document.getElementById("sortBy-dropdown").value
    return [name, conservationStatus, sortBy]
}

function changeBirdsDisplayed(searchCriteria) {

}

