const searchForm = document.querySelector("#search-form")

const userForm = document.querySelector("#user-form")

const newUserForm = document.querySelector("#newuser-form")
const newUserButton = document.querySelector("#newuser-button")

const logInForm = document.querySelector("#login-form")
const logInButton = document.querySelector("#login-button")

const signUpButton = document.querySelector("#signup-button")

const weatherDiv = document.querySelector("#weather-div")

let favoritesColumn = document.querySelector("#favorites-column")

const fiveDayDiv = document.getElementById("five-day-forcast")

function main() {
    return document.querySelector("main")
}

function searchList() {
    return document.querySelector("#search-list")
}

let login

document.addEventListener("DOMContentLoaded", ()=>{
    login = false

    searchForm.addEventListener("submit", searchSubmitHandler)

    logInForm.addEventListener("submit", logInSubmitHandler)
    logInButton.addEventListener("click", logInSubmitHandler)

    signUpButton.addEventListener("click", signUpClickHandler)

    newUserForm.addEventListener("submit", newUserSubmitHandler)
    newUserButton.addEventListener("click", newUserSubmitHandler)

    getLocation()

})



