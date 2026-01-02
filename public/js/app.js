console.log("Client side js");
// region fetch data
const fetchData = async (location) => {
  console.log("Fetching weather for:", location);

  try {
    const res = await fetch(`/weather?address=${encodeURIComponent(location)}`);
    console.log("Response status:", res?.status);

    const data = await res.json();
    console.log("Weather API data:", data);

    if (data.error) {
      weatherCard.classList.add("hidden");
      noResults.textContent = data.error;
      return;
    }

    renderWeather(data);
    noResults.textContent = "";
  } catch (err) {
    console.error("Fetch error:", err);
    weatherCard.classList.add("hidden");
    noResults.textContent = "Unable to fetch weather data";
  }
};
// endregion

// region DOM selector
const getEl = (id) => {
  try {
    const el = document.getElementById(id);
    if (!el) {
      throw new Error(`Element with id '${id}' not found`);
    }
    return el;
  } catch (err) {
    console.error("getEl error:", err);
    alert(err?.message ?? "Element not found");
  }
};
// endregion

// region Elements
const btn = getEl("get-weather");
const search = getEl("city-input");
const weatherCard = getEl("weather-result");
const noResults = getEl("no-results");
// endregion

// region Render UI
const renderWeather = (data) => {
  const { location, weather } = data;

  weatherCard.innerHTML = `
        <div class="weather-header">
            <img src="${weather?.icon}" alt="${weather?.description}">
            <h3>${weather?.description}</h3>
        </div>

        <div class="temp">${weather?.temperature}°C</div>
        <div class="location">
            ${location?.name}, ${location?.region}, ${location?.country}<br>
            <small>Local time: ${location?.localtime}</small>
        </div>

        <div class="weather-details">
            <div>Feels like: ${weather?.feelslike}°C</div>
            <div>Humidity: ${weather?.humidity}%</div>
            <div>Wind: ${weather?.windSpeed} km/h ${weather?.windDir}</div>
            <div>Visibility: ${weather?.visibility} km</div>
            <div>UV Index: ${weather?.uvIndex}</div>
            <div>${weather?.isDay === "yes" ? "Day " : "Night "}</div>
        </div>
    `;

  weatherCard.classList.remove("hidden");
};
// endregion

// region handle click
const handleClick = () => {
  console.log("Button clicked");

  const location = search.value.trim();
  console.log("Entered location:", location);

  if (!location) {
    weatherCard.classList.add("hidden");
    noResults.textContent = "Please enter a location";
    return;
  }
  search.value = "";
  noResults.textContent = "";
  weatherCard.classList.add("hidden");
  fetchData(location);
};
// endregion

// region Event listener
btn.addEventListener("click", handleClick);
search.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleClick();
  }
});
// endregion
