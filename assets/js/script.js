// Get references to DOM elements
var searchButton = document.getElementById("search-button");
var searchInput = document.getElementById("search-input");

function citySearch() {
  var city = searchInput.value.trim();
  // Maybe validate only for valid cities next
  if (city) {
    setNewCityToLocalStorage(city);
  }
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

// Register event listener with callback function citySearch
searchButton.addEventListener("click", citySearch);
