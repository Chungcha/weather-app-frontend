const form = document.getElementById("search-form")

document.addEventListener("DOMContentLoaded", ()=>{
    
    form.addEventListener("submit", renderSearch)

})

function renderSearch(event){
    event.preventDefault();

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
    .then(response=>response.json())
    .then(cityArr=>cityArr.forEach(city=>renderResult(city)))
}

function renderResult(city){
    console.log(city)
}