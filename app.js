// Step 1: Add your API key
const apiKey = "e78698b82a45e75b2e0f5ab26e283d48";

// Step 2: Choose a city
const city = "London";

// Step 3: Create API URL
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

// Step 4: Fetch weather data
axios.get(url)
.then(function(response) {

    const data = response.data;

    document.getElementById("city").textContent = data.name;

    document.getElementById("temperature").textContent =
        "Temperature: " + data.main.temp + "°C";

    document.getElementById("description").textContent =
        data.weather[0].description;

    const iconCode = data.weather[0].icon;

    document.getElementById("icon").src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

})
.catch(function(error) {
    console.log("Error:", error);
});