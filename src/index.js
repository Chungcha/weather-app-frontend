const searchURL = "https://www.metaweather.com/api/location/search/?query="

document.addEventListener("DOMContentLoaded", () => {
    fetchLocation()
})

function fetchLocation() {
    fetch(`${searchURL}London`)
        .then(resp => resp)
        .then(resp => resp.json())
        .then(data => {
            debugger 
        } )
}