function logInSubmitHandler(event) {
    event.preventDefault()
    
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
    .then(userObj => {
        if (userObj == null){
            logInForm.username.value=""
            alert ("User Not Found")
        } else {
        userForm.innerHTML = ""
        renderUser(userObj)}})
    
}

function renderUser(userObj){
    // document.getElementById("favorites").style.marginTop = "60px";
    login = userObj.id
    welcomeMessage(userObj)
    let favorites = userObj.favorites 
    if (userObj.favorites === undefined) {
        console.log("no favorites yet")
    } else {
        favorites.forEach(favorite => favoriteHandler(favorite))
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
     
    let favoriteId = favorite.id 
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
    .then(fave => {
        
        renderFavoriteLocation(fave, favoriteId)})
}

function renderFavoriteLocation(fave, favoriteId) { ///
    favoritesColumn.className = "three wide column"

    let itemDiv = document.createElement("div")
    itemDiv.dataset.woeid = fave.woeid
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
    headerDiv.dataset.favoriteId = favoriteId 
    headerDiv.innerText = `${fave.title}`
    
    itemDiv.addEventListener("click", clickHandler)
    
    favorites.append(itemDiv)
    itemDiv.append(img, contentDiv)
    contentDiv.append(headerDiv)

    $(document).ready(function(){
        $('div#favorites div.item').on('click', function() {
            $('div#favorites div.item').removeClass('active');
            $(this).addClass('active');
        });             
    });
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

