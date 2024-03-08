var searchButton = document.getElementById("search-button");
var searchInput = document.getElementById("search-input");
var APItoken = "604a01f8b6790b14c2c34ec56f00eaa6";
var currentDate = dayjs().format("DD/MM/YYYY");

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
      var weatherTodayIcon = data.weather[0].icon;
      var todayIcon = `<img src="https://openweathermap.org/img/wn/${weatherTodayIcon}@2x.png"/>`;
      cityName = data.name ? data.name : data.message;
      weatherToday.style.border = "2px solid black";
      weatherToday.style.padding = "10px";
      weatherToday.innerHTML = "<h2>" + cityName + " (" + currentDate + ")" + todayIcon;

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
      // Rendering Storage
      renderStorage();
      renderForecast(data.coord.lat, data.coord.lon);
    })
    .catch(function (error) {
      alert("Error fetching data, city not found");
      console.error("Error fetching data:", error);
    });
}

function renderForecast(lat, lon) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=metric" +
    "&appid=" +
    APItoken;

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var weatherForecast = document.getElementById("forecast");
      weatherForecast.innerHTML = "<h2><b>5-Day Forecast: </b></h2>";

      for (let i = 7; i < data.list.length; i += 7) {
        var forecastItem = data.list[i];
        var forecastCardDate = forecastItem.dt_txt.split(" ")[0];
        var formattedDate = formatDate(forecastCardDate);
        var forecastCardIcon = forecastItem.weather[0].icon;
        var forecastCardTemp = forecastItem.main.temp;
        var forecastCardWind = forecastItem.wind.speed;
        var forecastCardHumidity = forecastItem.main.humidity;

        var forecastCard = `
              <div class="card border border-white" style="width: 20%;">
                  <div class="card-body text-white" style="background-image: linear-gradient(to left top, #2b60ca, #27086b)">
                      <h5 class="card-title">${formattedDate}</h5>
                      <p class="card-text"><img src="https://openweathermap.org/img/wn/${forecastCardIcon}@2x.png"/>
                      </p>
                      <p class="card-text">Temp: ${forecastCardTemp} °C</p>
                      <p class="card-text">Wind: ${forecastCardWind} KPH</p>
                      <p class="card-text">Humidity: ${forecastCardHumidity} %</p>
                  </div>
              </div>`;
        weatherForecast.insertAdjacentHTML('beforeend', forecastCard);
      }
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

function formatDate(date) {
  var parts = date.split("-");
  return parts[2] + "/" + parts[1] + "/" + parts[0];
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
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }
}

// Initial rendering of storage
renderStorage();
