const API_KEY = '4013d5a598e37410ac68e0a46250aead';

// fetch request gets  weather
var requestUrl = "https://api.openweathermap.org/data/2.5/forecast";


/* City Search Functions */
var searchButton = document.getElementById('search-button');
var cityEl = document.getElementById('city-input');
searchButton.addEventListener('click', showWeather);
var cities = [];

function showWeather(event) {
    event.preventDefault();
    var city = cityEl.value.trim();

    if (city) {
        getWeather(city);
        getFiveDayWeather(city);
        cities.unshift({ city });
        cityEl.value = "";
        localStorage.setItem("cities", JSON.stringify(cities));
        previousSearch(city);

    }
    else {
        alert("Please enter a City Name");
    }


}
