const searchForm = document.querySelector("#search-form")

const userForm = document.querySelector("#user-form")

const newUserForm = document.querySelector("#newuser-form")
const newUserButton = document.querySelector("#newuser-button")

const logInForm = document.querySelector("#login-form")
const logInButton = document.querySelector("#login-button")

const signUpButton = document.querySelector("#signup-button")

const weatherDiv = document.querySelector("#weather-div")

let favoritesColumn = document.querySelector("#favorites-column")

function main() {
    return document.querySelector("main")
}

function searchList() {
    return document.querySelector("#search-list")
}

document.addEventListener("DOMContentLoaded", ()=>{

    searchForm.addEventListener("submit", searchSubmitHandler)

    newUserForm.addEventListener("submit", newUserSubmitHandler)
    newUserButton.addEventListener("click", newUserSubmitHandler)

    logInForm.addEventListener("submit", logInSubmitHandler)
    logInButton.addEventListener("click", logInSubmitHandler)

    signUpButton.addEventListener("click", signUpClickHandler)

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
    
    weatherDiv.innerHTML = ""

    let currentForecast = forecastArr.consolidated_weather[0] 

    let div = document.createElement("div")
    div.classList.add("column", "field")

    let subHeader = document.getElementById("subHeader")
    subHeader.innerText = `${forecastArr.title}, ${forecastArr.parent.title}`

    let img = document.createElement("img")
    img.id = "main-image"
    img.src = `https://www.metaweather.com/static/img/weather/${currentForecast.weather_state_abbr}.svg`

    weatherDiv.append(div)

    div.append(img)

    renderTemps(forecastArr)
}

function newUserSubmitHandler(event) {
    event.preventDefault()

    let username = newUserForm.username.value

    postNewUser(username)

    newUserForm.innerHTML = ""
}

function postNewUser(username) {
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
    .then(userObj => renderUser(userObj))
}

function logInSubmitHandler(event) {
    event.preventDefault()

    userForm.innerHTML = ""
    
    let username = logInForm.username.value 
    
    postExistingUser(username)
}

function postExistingUser(username) {
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
    .then(userObj => renderUser(userObj))
}

function renderUser(userObj){
    welcomeMessage(userObj)
    let favorites = userObj.favorites 
    if (userObj.favorites === undefined) {
        console.log("no favorites yet")
    } else {
        favorites.forEach(favorite => favoriteHandler(favorite))
        favoritesColumn.style.display = "inline-block"
    }
}

function welcomeMessage(userObj) {
    let welcomeMessage = document.querySelector("#welcome-message")
    welcomeMessage.innerText = `Welcome ${userObj.username}`
}

function favoriteHandler(favorite) {
    postFavoriteLocation(favorite)
}

function postFavoriteLocation(favorite) {
    
    fetch("http://localhost:3000/location", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
    body: JSON.stringify({
        location_id: favorite.location_id
    })
    })
    .then(response => response.json())
    .then(fave => renderFavoriteLocation(fave))
}

function renderFavoriteLocation(fave) {
    let itemDiv = document.createElement("div")
    itemDiv.className = "item"

    let img = document.createElement("img")
    img.className = "ui avatar image"
    let forecastImg = fave.consolidated_weather[0].weather_state_abbr
    img.src =  `https://www.metaweather.com/static/img/weather/${forecastImg}.svg`

    let contentDiv = document.createElement("div")
    contentDiv.className = "content"

    let headerDiv = document.createElement("div")
    headerDiv.className = "header"
    headerDiv.innerText = `${fave.title}`
    
    favorites.append(itemDiv)
    itemDiv.append(img, contentDiv)
    contentDiv.append(headerDiv)
}

function signUpClickHandler(event) { 
    userForm.innerHTML = ""

    let input = document.createElement("input")
    input.type = "text"
    input.name = "username"
    input.placeholder = "Username"

    let i = document.createElement("i")
    i.className = "user icon"

    let left = document.querySelector(".ui.left.icon.input")
    left.append(input, i)    
    
    let div = document.createElement("div")
    div.className = "ui blue submit button"
    div.innerText = "Sign Up"

    newUserButton.append(div)
}

function renderTemps(forecastArr){
    const todaysArr = forecastArr.consolidated_weather[0]
    let div = document.createElement("div")
    
    div.innerHTML=`
    <div class="statistic">
        <div class="label">
            ${convertTemp(todaysArr.max_temp)} ${convertTemp(todaysArr.min_temp)}
        </div>
        <div class="value">
            ${convertTemp(todaysArr.the_temp)}
         </div>
        <div class="label">
             ${todaysArr.weather_state_name}
        </div>
    </div>`
    div.classList.add("column", "field", "ui", "statistics")
    // let p = document.createElement("p")
    // p.innerText="hi"
    // div.appendChild(p)
    weatherDiv.append(div)
}

function convertTemp(celcius){
    return `${ Math.round(celcius*(9/5)+32)}°F`
}
        
