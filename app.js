function WeatherApp() {
    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.weatherContainer = document.getElementById("weatherContainer");
    this.apiKey = "e78698b82a45e75b2e0f5ab26e283d48";
}

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
    this.cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            this.handleSearch();
        }
    });

    this.showWelcome();
};

WeatherApp.prototype.showWelcome = function () {
    this.weatherContainer.innerHTML = "<p>Search for a city to see weather details 🌍</p>";
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city name.");
        return;
    }

    this.getWeather(city);
    this.cityInput.value = "";
};

WeatherApp.prototype.showLoading = function () {
    this.weatherContainer.innerHTML = `
        <div class="loader"></div>
        <p>Loading weather data...</p>
    `;
};

WeatherApp.prototype.showError = function (message) {
    this.weatherContainer.innerHTML = `<div class="error">${message}</div>`;
};

WeatherApp.prototype.getWeather = async function (city) {
    try {
        this.showLoading();
        this.searchBtn.disabled = true;

        const currentWeatherURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

        const forecastURL =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

        const [currentResponse, forecastResponse] = await Promise.all([
            axios.get(currentWeatherURL),
            axios.get(forecastURL)
        ]);

        this.displayWeather(currentResponse.data);
        this.displayForecast(forecastResponse.data);

    } catch (error) {
        this.showError("City not found or API error.");
    } finally {
        this.searchBtn.disabled = false;
    }
};

WeatherApp.prototype.displayWeather = function (data) {
    this.weatherContainer.innerHTML = `
        <h2>${data.name}</h2>
        <p>🌡 Temp: ${data.main.temp}°C</p>
        <p>☁ ${data.weather[0].description}</p>
        <hr>
        <div id="forecast"></div>
    `;
};

WeatherApp.prototype.processForecastData = function (forecastList) {
    return forecastList.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (data) {
    const forecastContainer = document.getElementById("forecast");
    const filteredData = this.processForecastData(data.list);

    forecastContainer.innerHTML = `<h3>5-Day Forecast</h3><div class="forecast-grid"></div>`;
    const grid = forecastContainer.querySelector(".forecast-grid");

    filteredData.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        grid.innerHTML += `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                <p>${day.main.temp}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    });
};

const app = new WeatherApp();
app.init();