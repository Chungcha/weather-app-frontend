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
    .then(forecastArr => renderForecast(forecastArr, woeid))
}

function renderForecast(forecastArr, woeid) {
    weatherDiv.innerHTML = ""

    let currentForecast = forecastArr.consolidated_weather[0] 

    let div = document.createElement("div")
    div.classList.add("column", "field")

    let subHeader = document.getElementById("subHeader")
    subHeader.innerText = `${forecastArr.title}, ${forecastArr.parent.title}`

    let span = document.querySelector("#icon")
    span.innerText = " ♡"
   
    renderFavButton(woeid, subHeader)

    let mainStatDiv = document.createElement("div")
    mainStatDiv.className = "ui huge statistic"

    let detailedStatsDiv = document.createElement("div")
    detailedStatsDiv.innerHTML=`<h4 class="ui horizontal divider header">
    <i class="bar th list icon"></i>
    Details
  </h4>
  <table class="ui definition table">
    <tbody>
      <tr>
        <td class="two wide column">Humidity</td>
        <td class="ui right aligned segment">${currentForecast.humidity}%</td>
      </tr>
      <tr>
        <td>Visibility</td>
        <td class="ui right aligned segment">${Math.round(currentForecast.visibility)} mi</td>
      </tr>
      <tr>
        <td>Air Pressure</td>
        <td class="ui right aligned segment">${currentForecast.air_pressure} mbar</td>
      </tr>
      <tr>
        <td>Wind Speed</td>
        <td class="ui right aligned segment">${Math.round(currentForecast.wind_speed)} mph</td>
      </tr>
    </tbody>
  </table>`

    let statDiv = document.createElement("div") 
    statDiv.className = "ui huge statistic"

    let highLowLabelDiv = document.createElement("div")
    highLowLabelDiv.className = "label"
    highLowLabelDiv.innerHTML= `&#8593; ${convertTemp(currentForecast.max_temp)}° &#8595; ${convertTemp(currentForecast.min_temp)}°`

    let valueDiv= document.createElement("div")
    valueDiv.className = "value"

    let imgDiv = document.createElement("div")
    imgDiv.className = "ui statistic"

    let img = document.createElement("img")
    img.className = "ui centered medium image"
    img.src = `https://www.metaweather.com/static/img/weather/png/${currentForecast.weather_state_abbr}.png`

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
    weatherDiv.append(imgDiv, mainStatDiv)
    mainStatDiv.appendChild(statDiv)
    mainStatDiv.appendChild(detailedStatsDiv)


    renderFavButton(woeid, subHeader)
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
        div.classList.add("card", "statistic", "item")

        let value= document.createElement("div")
        value.classList.add("value")
        div.appendChild(value)

        let text = document.createTextNode(`
        ${convertTemp(eachDay.the_temp)}°F`)

        let image = document.createElement("img")
        image.className = "ui circular inline image"
        image.src=`https://www.metaweather.com/static/img/weather/png/${eachDay.weather_state_abbr}.png`
        value.appendChild(image)
        value.appendChild(text)
        
        let day = document.createElement("div")
        day.classList.add("label")
        day.innerText=`${getDay(eachDay.applicable_date)}`

        div.appendChild(day)
        fiveDayDiv.appendChild(div)
    })
   
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

function renderFavButton(woeid, subHeader){
    let favoriteDiv = document.querySelector(`div.header[data-woeid='${woeid}']`)
    let favoriteId 

    if (favoriteDiv) {
        favoriteId = favoriteDiv.dataset.favoriteId 
    }

    if (login) {
        let span = document.querySelector("#icon") 
        span.dataset.woeid = woeid
        if (favoriteDiv) {  
            span.innerText = " ♥"
        } 
        span.addEventListener("click", toggleHandler)
    }
}

function toggleHandler(event) { 
    
    let woeId = event.target.dataset.woeid 
    
    if (event.target.innerText === "♥") { 
        let favoriteDiv = document.querySelector(`div.header[data-woeid='${woeId}']`)
        let favoriteId = favoriteDiv.dataset.favoriteId 
         
        unfavorite(event, favoriteDiv, favoriteId)
    } else { 
         
        favorite(event)
    }
}

function unfavorite(event, favoriteDiv, favoriteId){   
    fetch(`http://localhost:3000/favorites/${favoriteId}`, {
        method: "DELETE"
    }).then(() => unrenderFavorite(event, favoriteDiv))
}

function unrenderFavorite(event, favoriteDiv) { 
    favoriteDiv.parentElement.parentElement.remove() 
    event.target.innerText = " ♡"
}

function favorite(event){ 
      
    let userId = login
    let woeId = event.target.dataset.woeid 

    fetch("http://localhost:3000/favorites", {
        method: "POST",
        headers:{
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
        body: JSON.stringify({
            user_id: userId,
            location_id: woeId
        })
    })
    .then(response => response.json())
    .then(favoriteObj => { 
        favoriteHandler(favoriteObj)
        event.target.innerText = " ♥"
    })
}
        // event.target.addEventListener("click", unfollow)
        // favoriteHandler(favorite, favorite.id)})
// }

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
