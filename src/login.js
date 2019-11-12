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
    login = userObj.id
    welcomeMessage(userObj)
    let favorites = userObj.favorites 
    if (userObj.favorites === undefined) {
        console.log("no favorites yet")
    } else {
        favorites.forEach(favorite => favoriteHandler(favorite))
        favoritesColumn.style.display = "inline-block"
    }
    renderLogOutButton()
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
    headerDiv.dataset.woeid = fave.woeid
    headerDiv.dataset.status = "favorited"
    headerDiv.innerText = `${fave.title}`
    
    
    headerDiv.addEventListener("click", clickHandler)
    
    favorites.append(itemDiv)
    itemDiv.append(img, contentDiv)
    contentDiv.append(headerDiv)
}

function renderLogOutButton() {
    let formDiv = document.createElement("div")
    formDiv.className = "ui form"

    let logOutButtonDiv = document.createElement("div")
    logOutButtonDiv.className = "ui blue submit button"
    logOutButtonDiv.innerText = "Logout"
    
    formDiv.append(logOutButtonDiv)
    userForm.append(formDiv)

    logOutButtonDiv.addEventListener("click", logOut)
}

function logOut() {
    document.location.reload(true)
}

