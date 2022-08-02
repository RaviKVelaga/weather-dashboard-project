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


function getWeather(city) {
    var qurey = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    // console.log(city, city.value,qurey);
    fetch(qurey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayWeather(data, city)
        });

}

/* Query for One Call API - this will give us our info for 5 Day Forecast cards */
function getFiveDayWeather(city) {
    var query5d = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;
    fetch(query5d)
        .then(function (response) {
            return response.json();
            //console.log(data,city);

        })
        .then(function (data) {
            console.log(data, city);
            displayFiveDayWeather(data, city);
        });
}


var weatherContainer = document.getElementById('current-weather-container');
var cityValueEl = document.getElementById('search-city');

function displayWeather(weather, city) {

    weatherContainer.textContent = "";
    cityValueEl.textContent = city;
    // console.log(weather,city);

    var currDate = document.createElement("span");
    currDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    cityValueEl.appendChild(currDate);

    console.log(`${weather.weather[0].icon}`);

    var icon = document.createElement("img");
    icon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    cityValueEl.appendChild(icon);

    var temp = document.createElement("span");
    temp.textContent = "Temperature: " + weather.main.temp + "  °F";
    temp.classList = "list-group-item"

    var humidity = document.createElement("span");
    humidity.textContent = "Humidity: " + weather.main.humidity + "  %";
    humidity.classList = "list-group-item"

    var speed = document.createElement("span");
    speed.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    speed.classList = "list-group-item"

    weatherContainer.appendChild(temp);
    weatherContainer.appendChild(humidity);
    weatherContainer.appendChild(speed);

    var longitude = weather.coord.lon;
    var latitude = weather.coord.lat;

    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${API_KEY}&lat=${latitude}&lon=${longitude}`
    fetch(apiURL)
        .then(function (response) {
            return response.json();


        })
        .then(function (data) {
            displayUvIndex(data)
        });


}

function displayUvIndex(uvData) {
    var uv = document.createElement("div");
    uv.textContent = " UV Index: ";
    uv.classList = "list-group-item";

    value = document.createElement("span");
    value.textContent = uvData.value;

    if (uvData.value <= 2) {
        value.classList = "favorable"
    } else if (uvData.value > 2 && uvData.value <= 8) {
        value.classList = "moderate "
    }
    else if (uvData.value > 8) {
        value.classList = "severe"
    }

    uv.appendChild(value);
    weatherContainer.appendChild(uv);
}

var forecastContainerEl = document.querySelector("#fiveday-container");
var forecastTitleEL = document.querySelector("#forecast");
function displayFiveDayWeather(city) {
    forecastContainerEl.textContent = "";
    forecastTitleEL.textContent = "5 Days Forecast:";

    var forecast = city.list;

    for (var i = 5; i < forecast.length; i = i + 8) {

        var dailyForecast = forecast[i];

        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-primary text-light m-2";

        var forcasteDate = document.createElement("h5");
        forcasteDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forcasteDate.classList = "card-header text-center";
        forecastEl.appendChild(forcasteDate);


        var icon = document.createElement("img");
        icon.classList = "card-body text-center";
        icon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);


        forecastEl.appendChild(icon);

        var tempEl = document.createElement("span");
        tempEl.classList = "card-body text-center";
        tempEl.textContent = dailyForecast.main.temp + " °F";

        forecastEl.appendChild(tempEl);

        var humidityEl = document.createElement("span");
        humidityEl.classList = "card-body text-center";
        humidityEl.textContent = dailyForecast.main.humidity + " %";

        forecastEl.appendChild(humidityEl);

        forecastContainerEl.appendChild(forecastEl);
    }

}

var pastSearchButtonEl = document.querySelector("#previous-search");
pastSearchButtonEl.addEventListener("click", searchPastCity);

// Sidebar with anthything in localStorage
function searchPastCity(event) {

    var previousCity = event.target.getAttribute("data-city");
    if (previousCity) {
        getWeather(previousCity);
        getFiveDayWeather(previousCity);
    }

}

function previousSearch(previousCity) {
    previousSearchEl = document.createElement("button");
    previousSearchEl.textContent = previousCity;
    previousSearchEl.classList = "d-flex w-100 btn-light border p-2";
    previousSearchEl.setAttribute("data-city", previousCity);
    previousSearchEl.setAttribute("type", "submit");
    pastSearchButtonEl.prepend(previousSearchEl);
}