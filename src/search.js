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

    let statDiv = document.createElement("div") 
    statDiv.className = "ui huge statistic"
    // statDiv.style = "padding-top: 96px;padding-bottom: 96px;padding-left: 0px;padding-right: 205px;"

    let highLowLabelDiv = document.createElement("div")
    highLowLabelDiv.className = "label"
    highLowLabelDiv.innerHTML= `&#8593; ${convertTemp(currentForecast.max_temp)}° &#8595; ${convertTemp(currentForecast.min_temp)}°`

    let valueDiv= document.createElement("div")
    valueDiv.className = "value"

    let imgDiv = document.createElement("div")
    imgDiv.className = "ui statistic"
    // imgDiv.style = "padding-left: 83px;"


    let img = document.createElement("img")
    img.className = "ui centered medium image"
    img.src = `https://www.metaweather.com/static/img/weather/png/${currentForecast.weather_state_abbr}.png`
    // img.style = "padding-top: 7px; padding-bottom: 7px;"

    imgDiv.append(img)

    let text = document.createTextNode(`
    ${convertTemp(currentForecast.the_temp)}°F`)

    valueDiv.append(text)
    
    let labelDiv = document.createElement("div")
    labelDiv.className = "label"
    labelDiv.innerText=`${getDay(currentForecast.applicable_date)}`

    statDiv.append(valueDiv, labelDiv)
    fiveDayDiv.append(statDiv)

    statDiv.append(highLowLabelDiv, valueDiv, labelDiv)
    weatherDiv.append(imgDiv, statDiv)

    renderFiveDay(forecastArr)
    renderSunBar(forecastArr)
    renderDetails(forecastArr)
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

function renderSunBar(forecastArr){
    sunBar.innerHTML = ""
    let sunrise = forecastArr.sun_rise.split("T")[1].slice(0,5)
    let sunset = forecastArr.sun_set.split("T")[1].slice(0,5)
    let time = forecastArr.time.split("T")[1].slice(0,5)
    
    let percentage = Math.floor((sunrise.slice(0,2) / (sunset.slice(0,2)) * 100))

    let bar = document.createElement("div")
    // myDiv.setAttribute("style", "border-color:#FFFFFF;");
    bar.innerHTML=`<span"float:left;><i class="sun icon">${sunrise}</i></span>
    
    <span style="float:right;">${sunset}<i class="moon icon"
    ></i></span>`
    bar.setAttribute("style", "width: 100%")
    bar.setAttribute("style", "background-color: #ddd");
    sunBar.appendChild(bar)
    
    let progress = document.createElement("div")
    bar.appendChild(progress)
    progress.innerHTML=`<i class="moon icon" style="float:right;"></i>`
    progress.style=`width: ${percentage}%;background-color: yellow; height:30px;`

}

// function convertTime(timeString){
//     let hour 
//     let period 
//     if (timeString.slice(0,2) > 12) {
//         hour = timeString.slice(0,2) - 12
//     } else {
//         hour = timeString.slice(0,2)
//     }
//     let minute = timeString.slice(3,5)
//     if (timeString.slice(0,2) < 12) {
//         period = "a.m."
//     } else {
//         period = "p.m."
//     }
//     let finalTime = `${hour}:${minute} ${period}`
//     return finalTime
// }

function renderDetails (forecastArr){
    detailsDiv
}