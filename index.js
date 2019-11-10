const form = document.getElementById("search-form")

function main() {
    return document.querySelector("main")
}

document.addEventListener("DOMContentLoaded", ()=>{
    form.addEventListener("submit", submitHandler)
    getLocation()
})

function submitHandler(event){
    event.preventDefault()

    main().innerHTML = ""

    let ul = document.createElement("ul")
    ul.id = "search-list"

    const searchValue = form.city.value

    fetchSearch(ul, searchValue)
}

function fetchSearch(ul, searchValue) {
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
    .then(resultsArr => resultsArr.forEach(result => renderSearch(ul, result)))
}

function renderSearch(ul, result){
    let li = document.createElement("li")
    li.dataset.woeid = result.woeid
    li.innerText = result.title 
    li.addEventListener("click", clickHandler)

    main().append(ul)
    ul.append(li)
}

function clickHandler(event) {
    main().innerHTML = ""

    let woeid = event.target.dataset.woeid 

    fetchLocation(woeid)
}

function fetchLocation(woeid) {
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
    let currentForecast = forecastArr.consolidated_weather[0] 

    let weatherState = currentForecast.weather_state_name

    let div = document.createElement("div")

    let subHeader = document.createElement("h3")
    subHeader.innerText = "Today"

    let span = document.createElement("span")
    span.innerText = weatherState

    let img = document.createElement("img")
    img.src = `https://www.metaweather.com/static/img/weather/${currentForecast.weather_state_abbr}.svg`

    main().append(div)

    div.append(subHeader, img, span)
}
