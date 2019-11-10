const form = document.getElementById("search-form")

function searchList() {
    return document.querySelector("#search-list")
}

document.addEventListener("DOMContentLoaded", ()=>{
    form.addEventListener("submit", fetchSearch)
    getLocation()
})

function fetchSearch(event){
    event.preventDefault();

    searchList().innerHTML = ""

    const searchValue = form.city.value
    
    fetch("http://localhost:3000/search", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
    body: JSON.stringify({
        search: searchValue
    })
    })
    .then(response => response.json())
    .then(resultsArr => resultsArr.forEach(result => renderSearch(result)))
}

function renderSearch(result){
    let main = document.querySelector("main")

    let li = document.createElement("li")
    li.dataset.woeid = result.woeid
    li.innerText = result.title 
    li.addEventListener("click", fetchLocation)

    main.append(searchList())
    searchList().append(li)
}

function fetchLocation(event) {
    let woeid = event.target.dataset.woeid 

    fetch("http://localhost:3000/location", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
    body: JSON.stringify({
        location: woeid
    })
    })
    .then(response => response.json())
    .then(forecastArr => renderForecast(forecastArr))
}

function renderForecast(forecastArr) {
    forecastArr
}