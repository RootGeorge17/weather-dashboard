// Get references to DOM elements
var searchButton = document.getElementById("search-button");
var searchInput = document.getElementById("search-input");

// Register event listener with callback function citySearch
searchButton.addEventListener("click", citySearch);

function citySearch(event) {
  event.preventDefault();

  var city = searchInput.value.trim();
  // Maybe validate only for valid cities next
  if (city) {
    setNewCityToLocalStorage(city);

    // Rendering Storage after adding new city
    renderStorage();
  }
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
