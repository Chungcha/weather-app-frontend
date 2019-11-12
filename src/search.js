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
    let favoriteId = event.target.dataset.favoriteId
    let woeid = event.target.dataset.woeid 
    let favorited
    let el = document.querySelector(`div.header[data-woeid='${event.target.dataset.woeid}']`)
    
    if (!!el== true){
        let favoriteId = el.dataset.favoriteId
        let woeid = el.dataset.woeid 
        favorited = true
        postLocation(woeid, favorited, favoriteId)
    } else if (!!el == false) {
        postLocation(woeid, favorited, favoriteId)
    }
}

function postLocation(woeid, favorited, favoriteId) {
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
    .then(forecastArr => renderForecast(forecastArr, favorited, favoriteId))
}

function renderForecast(forecastArr, favorited, favoriteId) {
    
    weatherDiv.innerHTML = ""

    let currentForecast = forecastArr.consolidated_weather[0] 

    let div = document.createElement("div")
    div.classList.add("column", "field")

    let subHeader = document.getElementById("subHeader")
    subHeader.innerText = `${forecastArr.title}, ${forecastArr.parent.title}`

    renderFavButton(forecastArr, favorited, favoriteId)

    let img = document.createElement("img")
    img.id = "main-image"
    img.src = `https://www.metaweather.com/static/img/weather/${currentForecast.weather_state_abbr}.svg`

    weatherDiv.append(div)

    div.append(img)

    renderTemps(forecastArr)
}

function renderFavButton(forecastArr, favorited, favoriteId){
    if (login && favorited) {
        let span = document.createElement("span")
        span.id = "heart"
        span.dataset.woeid = forecastArr.woeid
        span.dataset.favoriteId = favoriteId
        span.innerText = " ♥"
        subHeader.append(span)
        span.addEventListener("click", unfollow)
    } else if (login) {
    let span = document.createElement("span")
    span.id = "heart"
    span.dataset.woeid = forecastArr.woeid
    span.dataset.favoriteId = favoriteId
    span.innerText = " ♡"
    subHeader.append(span)
    span.addEventListener("click", follow)
    }
}

function renderTemps(forecastArr){
    const todaysArr = forecastArr.consolidated_weather[0]
    let div = document.createElement("div")
    
    div.innerHTML=`
    <div class="statistic">
        <div class="label">
           &#8593; ${convertTemp(todaysArr.max_temp)}° &#8595; ${convertTemp(todaysArr.min_temp)}°
        </div>
        <div class="value">
            ${convertTemp(todaysArr.the_temp)}°F
         </div>
        <div class="label">
             ${todaysArr.weather_state_name}
        </div>
    </div>`
    div.classList.add("column", "field", "ui", "statistics")
    weatherDiv.append(div)
    renderFiveDay(forecastArr)
}

function convertTemp(celcius){
    return `${ Math.round(celcius*(9/5)+32)}`
}
        
function renderFiveDay(forecastArr){
    fiveDayDiv.innerHTML = "";
    const fiveDayArr = forecastArr.consolidated_weather.slice(1,6)

    fiveDayArr.forEach(eachDay=>{
        
        let div = document.createElement("div")
        div.classList.add("card", "statistic")

        let value= document.createElement("div")
        value.classList.add("value")
        // value.innerText= `${convertTemp(eachDay.the_temp)}°F`
        div.appendChild(value)

        // let text = document.createTextNode(`${convertTemp(eachDay.the_temp)}°F`)
        let text = document.createTextNode(`
        ${convertTemp(eachDay.the_temp)}°F
      `)

        let image=document.createElement("img")
        image.classList.add("ui", "circular", "inline", "image")
        image.src="https://www.metaweather.com/static/img/weather/ico/sn.ico"
        value.appendChild(image)
        value.appendChild(text)
        
        let day = document.createElement("div")
        day.classList.add("label")
        day.innerText=`${getDay(eachDay.applicable_date)}`

        div.appendChild(day)
        fiveDayDiv.appendChild(div)
    })
    // remember to clear out the div everytime cards are generated
}

function getDay(dateString){
    let monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];
    const dateArray = dateString.split("-")
    let newDateFormat = `${monthNames[dateArray[1]-1]} ${dateArray[2]}, ${dateArray[0]}`
    let date = new Date (newDateFormat)
    let weekday = date.getDay()
    let options = { weekday: 'long'}
    let newWeekday = new Intl.DateTimeFormat('en-US', options).format(date)
    return newWeekday
}

function unfollow(event){
    event.target.innerText= " ♡"
    const favId = event.target.dataset.favoriteId
    let el = document.querySelector(`div.header[data-favorite-id='${favId}']`)
    el.parentElement.parentElement.remove()
    fetch(`http://localhost:3000/favorites/${favId}`,{
        method: "DELETE"
    })
    .then(response=>response.json())
    .then(object=>{
        event.target.addEventListener("click", follow)
    })
}

function follow(event){
    const userId = login
    const woeId = event.target.dataset.woeid
    const favId = event.target.dataset.favoriteId

    fetch("http://localhost:3000/favorites",{
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
        body: JSON.stringify({
            userId: userId,
            woeId: woeId
        })
    })
    .then(response => response.json())
    .then(favorite => {
        event.target.innerText = " ♥"
        event.target.addEventListener("click", unfollow)
        favoriteHandler(favorite, favorite.id)})
}