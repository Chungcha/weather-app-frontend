const h2 = document.getElementById("h2");


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition)
  } else {
    h2.innerHTML = "Geolocation is not supported by this browser."
  }
}

function showPosition(position) {
  h2.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
}
