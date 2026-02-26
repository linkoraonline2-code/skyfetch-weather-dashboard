const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherContainer = document.getElementById("weatherContainer");

// Show loading spinner
function showLoading() {
    weatherContainer.innerHTML = `
        <div class="loader"></div>
        <p>Loading weather data...</p>
    `;
}

// Show error message
function showError(message) {
    weatherContainer.innerHTML = `
        <div class="error">${message}</div>
    `;
}

// Fetch weather data
async function getWeather(city) {
    try {
        showLoading();
        searchBtn.disabled = true;

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e78698b82a45e75b2e0f5ab26e283d48&units=metric`
        );

        const data = response.data;

        weatherContainer.innerHTML = `
            <h2>${data.name}</h2>
            <p>🌡 Temperature: ${data.main.temp}°C</p>
            <p>☁ Condition: ${data.weather[0].description}</p>
            <p>💧 Humidity: ${data.main.humidity}%</p>
            <p>🌬 Wind Speed: ${data.wind.speed} m/s</p>
        `;

    } catch (error) {
        if (error.response && error.response.status === 404) {
            showError("City not found. Please enter a valid city.");
        } else {
            showError("Something went wrong. Please try again.");
        }
    } finally {
        searchBtn.disabled = false;
    }
}

// Button click event
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
    cityInput.value = "";
});

// Enter key support
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});