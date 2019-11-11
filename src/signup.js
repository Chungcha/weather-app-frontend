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