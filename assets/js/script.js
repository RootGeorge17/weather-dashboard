var searchButton = document.getElementById("search-button");
var searchInput = document.getElementById("search-input");
var APItoken = "604a01f8b6790b14c2c34ec56f00eaa6";

// Register event listener with callback function citySearch
searchButton.addEventListener("click", citySearch);

function citySearch(event) {
  event.preventDefault();

  var city = searchInput.value.trim();
  searchInput.value = "";

  // Maybe validate only for valid cities next
  if (city) {
    renderCurrentWeather(city);
  }
}

function renderCurrentWeather(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric" +
    "&appid=" +
    APItoken;

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var weatherToday = document.getElementById("today");
      weatherToday.innerHTML = "<h2>" + city;

      var tempCelsius = document.createElement("p");
      var tempInCelsius = data.main.temp;
      tempCelsius.textContent = "Temp: " + tempInCelsius.toFixed(2) + "°C";

      var wind = document.createElement("p");
      var windInKPH = data.wind.speed * 3.6;
      wind.textContent = "Wind: " + windInKPH.toFixed(2) + " KPH";

      var humidity = document.createElement("p");
      humidity.textContent = "Humidity: " + data.main.humidity + "%";

      // Append to the HTML container
      weatherToday.appendChild(tempCelsius);
      weatherToday.appendChild(wind);
      weatherToday.appendChild(humidity);

      setNewCityToLocalStorage(city);
      // Rendering Storage after adding new city
      renderStorage();
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

function renderStorage() {
  var citiesList = document.getElementById("history");
  citiesList.innerHTML = "";

  var cities = getCitiesFromLocalStorage();

  cities.forEach((city) => {
    var listCity = document.createElement("button");
    listCity.textContent = city;
    listCity.classList.add("city-button");
    citiesList.appendChild(listCity);
  });
}

// Function to retrieve cities from local storage
function getCitiesFromLocalStorage() {
  var cities = localStorage.getItem("cities");
  return cities ? JSON.parse(cities) : [];
}

// Function to save cities to local storage
function setNewCityToLocalStorage(city) {
  var cities = getCitiesFromLocalStorage();
  cities.push(city);
  localStorage.setItem("cities", JSON.stringify(cities));
}

// Initial rendering of storage
renderStorage();
