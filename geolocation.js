const h2 = document.getElementById("h2");


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchGeoLocation)
  } else {
    h2.innerHTML = "Geolocation is not supported by this browser."
  }
}

function showPosition(position) {
  h2.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
}

function fetchGeoLocation(position){
    const latitude = position["coords"]["latitude"].toFixed(2)
    const longitude = position["coords"]["longitude"].toFixed(2)
    const positionString = `${latitude},${longitude}`
    
    fetch("http://localhost:3000/geolocation",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
    body: JSON.stringify({
        coordinates: positionString
    })
    })
    .then(response => response.json())
    .then(results => console.log(results))
}
