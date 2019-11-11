const searchForm = document.querySelector("#search-form")
const searchButton = document.querySelector("#search-button")

const newUserForm = document.querySelector("#newuser-form")

const logInForm = document.querySelector("#login-form")
const logInButton = document.querySelector("#login-button")

const signUpButton = document.querySelector("#signup-button")

const favsList = document.querySelector("#favs-list")

function main() {
    return document.querySelector("main")
}

function searchList() {
    return document.querySelector("#search-list")
}

document.addEventListener("DOMContentLoaded", ()=>{

    searchForm.addEventListener("submit", searchSubmitHandler)
    searchButton.addEventListener("click", searchSubmitHandler)

    newUserForm.addEventListener("submit", newUserSubmitHandler)

    logInForm.addEventListener("submit", logInSubmitHandler)
    logInButton.addEventListener("click", logInSubmitHandler)

    // signUpButton.addEventListener("click", )

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
        location_id: woeid
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

function newUserSubmitHandler(event) {
    event.preventDefault()
    
    // let div = document.querySelector("#login-div")
    
    let username = newUserForm.username.value

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
    .then(response => response.json())
    .then(userObj => welcomeMessage(userObj))
}

function welcomeMessage(userObj) {
    console.log(userObj)
}

function logInSubmitHandler(event) {
    event.preventDefault()
    
    let username = logInForm.username.value 
    
    postUser(username)
}

function postUser(username) {
    fetch(`http://localhost:3000/users/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
    body: JSON.stringify({
        username: username
    })
    })
    .then(response => response.json())
    .then(resp => {
        debugger
        resp.forEach(resp=>postFavs(resp.location_id))})
}

// // function postFavs(woeid){
// //     fetch("http://localhost:3000/location", {
// //         method: "POST",
// //         headers: {
// //             'Content-Type': 'application/json',
// //             "Accept": "application/json"
// //         },
// //     body: JSON.stringify({
// //         location_id: woeid
// //     })
// //     })
// //     .then(response => response.json())
// //     .then(forecastArr => console.log(forecastArr))
// // }
//     .then(resp => renderUser(resp))
// }

// function renderUser(resp){
//     console.log(resp)
// }
