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

    let span = document.createElement("span")
    span.id = "heart"
    span.innerText = " ♡"
    subHeader.append(span)

    let img = document.createElement("img")
    img.id = "main-image"
    img.src = `https://www.metaweather.com/static/img/weather/${currentForecast.weather_state_abbr}.svg`

    weatherDiv.append(div)

    div.append(img)

    renderTemps(forecastArr)
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
        