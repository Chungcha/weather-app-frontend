const searchForm = document.querySelector("#search-form")

const loginForm = document.querySelector("#login-form")

function main() {
    return document.querySelector("main")
}

function searchList() {
    return document.querySelector("#search-list")
}

document.addEventListener("DOMContentLoaded", ()=>{

    searchForm.addEventListener("submit", searchSubmitHandler)

    loginForm.addEventListener("submit", loginSubmitHandler)

    getLocation()

})

function searchSubmitHandler(event){
    event.preventDefault()

    searchList().innerHTML = ""

    const searchValue = searchForm.city.value

    postSearch(searchValue)
}

function postSearch(searchValue) {
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
    let li = document.createElement("li")
    li.dataset.woeid = result.woeid
    li.innerText = result.title 
    li.addEventListener("click", clickHandler)

    main().append(searchList())
    searchList().append(li)
}

function clickHandler(event) {
    searchList().innerHTML = ""

    let woeid = event.target.dataset.woeid 

    postLocation(woeid)
}

function postLocation(woeid) {
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

function loginSubmitHandler(event) {
    event.preventDefault()
    
    let username = loginForm.username.value

    postUser(username)
}

function postUser(username) {
    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
    body: JSON.stringify({
        username: username
    })
    })
}
