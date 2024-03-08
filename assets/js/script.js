var searchButton = document.getElementById("search-button");
var searchInput = document.getElementById("search-input");

// API token for OpenWeatherMap
var APItoken = "604a01f8b6790b14c2c34ec56f00eaa6";

// Get current date formatted as "DD/MM/YYYY"
var currentDate = dayjs().format("DD/MM/YYYY");

// Register event listener with callback function citySearch
searchButton.addEventListener("click", citySearch);

// Function to handle city search
function citySearch(event) {
  // Prevent form submission
  event.preventDefault();

  // Get the value of the input and trim whitespace
  var city = searchInput.value.trim();
  // Clear the input field after submission
  searchInput.value = "";

  // Check if the input value is not empty
  if (city) {
    // Render current weather for the searched city
    renderCurrentWeather(city);
  }
}

// Function to render current weather for a city
function renderCurrentWeather(city) {
  // Construct the API query URL for current weather data
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric" +
    "&appid=" +
    APItoken;

  // Fetch current weather data from the API
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      // Get the HTML element for displaying current weather
      var weatherToday = document.getElementById("today");

      // Get the weather icon URL
      var weatherTodayIcon = data.weather[0].icon;
      var todayIcon = `<img src="https://openweathermap.org/img/wn/${weatherTodayIcon}@2x.png"/>`;

      // Determine the city name, use the actual city name if available, otherwise use the message from the API
      var cityName = data.name ? data.name : data.message;

      weatherToday.style.border = "2px solid black";
      weatherToday.style.padding = "10px";
      weatherToday.innerHTML = "<h2>" + cityName + " (" + currentDate + ")" + todayIcon;

      // Create HTML elements to display temperature, wind speed, and humidity
      var tempCelsius = document.createElement("p");
      var tempInCelsius = data.main.temp;
      tempCelsius.textContent = "Temp: " + tempInCelsius.toFixed(2) + "°C";

      var wind = document.createElement("p");
      var windInKPH = data.wind.speed * 3.6;
      wind.textContent = "Wind: " + windInKPH.toFixed(2) + " KPH";

      var humidity = document.createElement("p");
      humidity.textContent = "Humidity: " + data.main.humidity + "%";

      // Append the HTML elements to display temperature, wind speed, and humidity
      weatherToday.appendChild(tempCelsius);
      weatherToday.appendChild(wind);
      weatherToday.appendChild(humidity);

      // Save the searched city to local storage
      setNewCityToLocalStorage(city);

      // Render the city search history
      renderStorage();

      // Render the weather forecast
      renderForecast(data.coord.lat, data.coord.lon);
    })
    .catch(function (error) {
      // Alert the user and log the error if city data cannot be fetched
      alert("Error fetching data, city not found");
      console.error("Error fetching data:", error);
    });
}

// Function to render weather forecast
function renderForecast(lat, lon) {
  // Construct the API query URL for weather forecast data
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=metric" +
    "&appid=" +
    APItoken;

  // Fetch weather forecast data from the API
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Get the HTML element for displaying weather forecast
      var weatherForecast = document.getElementById("forecast");
      weatherForecast.innerHTML = "<h2><b>5-Day Forecast: </b></h2>";

      // Iterate over the forecast data to render forecast cards for each day
      for (let i = 7; i < data.list.length; i += 8) {
        var forecastItem = data.list[i];
        var forecastCardDate = forecastItem.dt_txt.split(" ")[0];
        var formattedDate = formatDate(forecastCardDate);
        var forecastCardIcon = forecastItem.weather[0].icon;
        var forecastCardTemp = forecastItem.main.temp;
        var forecastCardWind = forecastItem.wind.speed;
        var forecastCardHumidity = forecastItem.main.humidity;

        // Construct HTML for forecast card
        var forecastCard = `
          <div class="card border border-white" style="width: 20%;">
              <div class="card-body text-white" style="background-image: linear-gradient(to left top, #2b60ca, #27086b)">
                  <h5 class="card-title">${formattedDate}</h5>
                  <p class="card-text">
                      <img src="https://openweathermap.org/img/wn/${forecastCardIcon}@2x.png"/>
                  </p>
                  <p class="card-text">Temp: ${forecastCardTemp} °C</p>
                  <p class="card-text">Wind: ${forecastCardWind} KPH</p>
                  <p class="card-text">Humidity: ${forecastCardHumidity} %</p>
              </div>
          </div>`;
        // Append forecast card HTML to the forecast section
        weatherForecast.insertAdjacentHTML('beforeend', forecastCard);
      }
    })
    .catch(function (error) {
      // Log the error if forecast data cannot be fetched
      console.error("Error fetching data:", error);
    });
}

// Function to format date as "dd/mm/yyyy"
function formatDate(date) {
  var parts = date.split("-");
  return parts[2] + "/" + parts[1] + "/" + parts[0];
}

// Function to render city search history from local storage
function renderStorage() {
  // Get the HTML element for displaying city search history
  var citiesList = document.getElementById("history");
  // Clear previous city search history
  citiesList.innerHTML = "";

  // Retrieve city search history from local storage
  var cities = getCitiesFromLocalStorage();

  // Iterate over the city search history to render city buttons
  cities.forEach((city) => {
    var listCity = document.createElement("button");
    listCity.textContent = city;
    listCity.classList.add("city-button");
    citiesList.appendChild(listCity);
  });
}

// Function to retrieve city search history from local storage
function getCitiesFromLocalStorage() {
  // Retrieve city search history from local storage
  var cities = localStorage.getItem("cities");
  // Parse the JSON string to an array, or return an empty array if no history is found
  return cities ? JSON.parse(cities) : [];
}

// Function to save newly searched city to local storage
function setNewCityToLocalStorage(city) {
  // Retrieve city search history from local storage
  var cities = getCitiesFromLocalStorage();
  // Add the new city to the history array if it's not already included
  if (!cities.includes(city)) {
    cities.push(city);
    // Save the updated city search history to local storage
    localStorage.setItem("cities", JSON.stringify(cities));
  }
}

// Initial rendering of city search history from local storage
renderStorage();