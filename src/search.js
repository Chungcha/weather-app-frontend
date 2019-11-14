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
    
    weatherArr = forecastArr

    weatherDiv.innerHTML = ""
    weatherDiv.className = "ui two segment statistics"

    let currentForecast = forecastArr.consolidated_weather[0] 

    let div = document.createElement("div")
    div.classList.add("column", "field")

    let subHeader = document.getElementById("subHeader")
    subHeader.innerText = `${forecastArr.title}, ${forecastArr.parent.title}`

    let span = document.querySelector("#icon")
    span.className = "like icon"
   
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
}

function convertTemp(celcius){
    return `${ Math.round(celcius*(9/5)+32)}`
}

let i

function renderFiveDay(forecastArr){
    fiveDayDiv.innerHTML = "";
    fiveDayDiv.className = "animated bottom attached tabular menu ui five tiny statistics"
    const fiveDayArr = forecastArr.consolidated_weather.slice(0,5)

    i = 0

    fiveDayArr.forEach(eachDay=>{
        
        let div = document.createElement("div")
        div.classList.add("card", "statistic", "item")
        div.dataset.index = i++

        let value= document.createElement("div")
        value.classList.add("value")
        div.appendChild(value)

        let text = document.createTextNode(`
        ${convertTemp(eachDay.the_temp)}°F`)

        let image = document.createElement("img")
        image.className = "ui inline image"
        image.src=`https://www.metaweather.com/static/img/weather/png/${eachDay.weather_state_abbr}.png`
        value.appendChild(image)
        value.appendChild(text)
        
        let day = document.createElement("div")
        day.classList.add("label")
        day.innerText=`${getDay(eachDay.applicable_date)}`

        div.appendChild(day)
        div.addEventListener("click", renderDay)
        fiveDayDiv.appendChild(div)
    })
    fiveDayDiv.firstChild.classList.add("active")

    $(document).ready(function(){
        $('div#five-day-forcast div.item').on('click', function() {
            $('div#five-day-forcast div.item').removeClass('active');
            $(this).addClass('active');
        });             
    });

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
            span.className = "like icon active"
        } 
        span.addEventListener("click", toggleHandler)
    }
}

function toggleHandler(event) { 
    let woeId = event.target.dataset.woeid 
     
    if (event.target.className === "like icon active") { 
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
    event.target.className = "like icon"
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
        event.target.className = "like icon active"
    })
}
        // event.target.addEventListener("click", unfollow)
        // favoriteHandler(favorite, favorite.id)})
// }

// function renderSunBar(forecastArr){
//     sunBar.innerHTML = ""
//     let sunrise = forecastArr.sun_rise.split("T")[1].slice(0,5)
//     let sunset = forecastArr.sun_set.split("T")[1].slice(0,5)
//     let time = forecastArr.time.split("T")[1].slice(0,5)
    
//     let percentage = Math.floor((sunrise.slice(0,2) / (sunset.slice(0,2)) * 100))

//     let bar = document.createElement("div")
//     // myDiv.setAttribute("style", "border-color:#FFFFFF;");
//     bar.innerHTML=`<span"float:left;><i class="sun icon">${sunrise}</i></span>
    
//     <span style="float:right;">${sunset}<i class="moon icon"
//     ></i></span>`
//     bar.setAttribute("style", "width: 100%")
//     bar.setAttribute("style", "background-color: #ddd");
//     sunBar.appendChild(bar)
    
//     let progress = document.createElement("div")
//     bar.appendChild(progress)
//     progress.innerHTML=`<i class="moon icon" style="float:right;"></i>`
//     progress.style=`width: ${percentage}%;background-color: yellow; height:30px;`

// }

function convertTime(timeString){
    let hour 
    let period 
    if (timeString.slice(0,2) > 12) {
        hour = timeString.slice(0,2) - 12
    } else {
        hour = timeString.slice(0,2)
    }
    let minute = timeString.slice(3,5)
    if (timeString.slice(0,2) < 12) {
        period = "a.m."
    } else {
        period = "p.m."
    }
    let finalTime = `${hour}:${minute} ${period}`
    return finalTime
}

function renderSunBar(forecastArr){
    document.getElementById("background").style.backgroundImage=''

    mainCont.classList.remove("day")
    mainCont.classList.remove("night")
    sunBar.innerHTML = ""

    document.getElementById("background").style.backgroundImage = `url("images/kumiko-shimizu-lNxMcE8mvIM-unsplash.jpg")`;
    document.getElementById("background").style.backgroundSize = "cover";

    let sunrise = forecastArr.sun_rise.split("T")[1].slice(0,5)
    let sunset = forecastArr.sun_set.split("T")[1].slice(0,5)
    let time = forecastArr.time.split("T")[1].slice(0,5)
    let percentage = Math.floor(((time.slice(0,2)-sunrise.slice(0,2))/(sunset.slice(0,2)-sunrise.slice(0,2))) * 100)
    sunBar.classList.remove("grey")
    sunBar.classList.add("ui", "yellow", "progress")

    let progress = document.createElement("div")
    progress.classList.add("bar")

    // let topLabel = document.createElement("div")

    // let sunRiseIcon = document.createElement("i")
    // sunRiseIcon.className="sun icon"
    // sunRiseIcon.setAttribute("style", "float: left;")

    // let sunSetIcon = document.createElement("i")
    // sunSetIcon.className = "moon icon"
    // sunSetIcon.setAttribute("style", "float:right;")

    let label = document.createElement("div")
    label.classList.add("label")

    let sunRiseSpan = document.createElement("span")
    sunRiseSpan.setAttribute("style", "float: left;")
    sunRiseSpan.innerText = convertTime(sunrise).slice(1,9)

    let sunSetSpan = document.createElement("span")
    sunSetSpan.setAttribute("style", "float:right;")
    sunSetSpan.innerText= convertTime(sunset)

    if (time.slice(0,2) <= sunrise.slice(0,2) || time.slice(0,2) >= sunset.slice(0,2)){

        sunBar.classList.remove("yellow")
        sunBar.classList.add("grey")

        document.getElementById("background").style.backgroundImage = `url("images/vincentiu-solomon-ln5drpv_ImI-unsplash.jpg")`

        document.getElementById("background").style.backgroundSize = "cover";

        sunRiseSpan.setAttribute("style", "float: right;")
        sunSetSpan.setAttribute("style", "float: left;")

        // (time.slice(0,2)-sunset.slice(0,2))/((24-sunset.slice(0,2))+ sunrise.slice(0,2)) 
    }



    // if (num > 100 || num < 0){
    //     sunBar.classList.remove("yellow")
    //     sunBar.classList.add("grey")

    //     sunRiseSpan.setAttribute("style", "float: right;")
    //     sunSetSpan.setAttribute("style", "float: left;")

        
    //     percentage = Math.abs(Math.floor(((time.slice(0,2)-sunset.slice(0,2))/(sunrise.slice(0,2)-sunset.slice(0,2))) * 100))
    // } else {
    //     percentage = = Math.floor(((time.slice(0,2)-sunrise.slice(0,2))/(sunset.slice(0,2)-sunrise.slice(0,2))) * 100)
    // }



    // topLabel.appendChild(sunRiseIcon)
    // topLabel.appendChild(sunSetIcon)
    label.append(sunRiseSpan, sunSetSpan)
    // sunBar.appendChild(topLabel)
    sunBar.appendChild(progress)
    sunBar.appendChild(label)

    $('#sunrise-sunset').progress({
        label: '<i class="sun icon">',
        percent: percentage
        });
}



function renderDay(event){
    let index = event.target.parentElement.dataset.index

    weatherDiv.innerHTML = ""
    let forecastArr = weatherArr
    let currentForecast = weatherArr.consolidated_weather[index] 

    let div = document.createElement("div")
    div.classList.add("column", "field")

    let subHeader = document.getElementById("subHeader")
    subHeader.innerText = `${forecastArr.title}, ${forecastArr.parent.title}`

    let span = document.querySelector("#icon")
    span.className = "like icon"

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
}