const APIROOT = 'https://api.openweathermap.org'
const APIKEY = '2af0ef1a0f66a04443807e8de444eb4d'

const searchFormEl = document.getElementById('citySearch')
const searchInputEl = document.getElementById('cityName')
const recentSearchEl = document.getElementById('recentSearchs')
const currentEl = document.getElementById('currentContainer')
const forecastEl = document.getElementById('forecastCards')
const dashBoardEl = document.getElementById('dashboard')

// This Function fetches the weather forecast using coordinates gathered by the coordsCall function
function weatherCall(location) {
    var { lat, lon } = location
    var city = location.name
    var weatherUrl = `${APIROOT}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKEY}`
    console.log(weatherUrl)
    fetch(weatherUrl)
        .then((res) => { return res.json() })
        .then((data) => {
            var { current, daily } = data
            renderForecastContainer(daily)
            renderCurrentContent(current, city)
        })
}
// This Function fetches the coordinates of the city searched by the user
function coordsCall(search) {
    var coordsUrl = `${APIROOT}/geo/1.0/direct?q=${search},US&appid=${APIKEY}`
    fetch(coordsUrl)
        .then((res) => { return res.json() })
        .then((data) => {
            if (!data) {
                alert('Your city was not found.')
            } else {
                weatherCall(data[0])
                saveSearch(search)
            }
        })
        .catch((err) => { console.error(err) })
}
//Search Input Handler
function searchSubmitHandler(e) {
    if (!searchInputEl.value) {
        return alert('Please Enter A CityName');
    }
    e.preventDefault()
    var cityName = searchInputEl.value.trim();
    console.log(cityName)
    coordsCall(cityName)
    searchInputEl.value = ''
}
// Recent search click handler 
function recentClickHandler(e) {
    e.preventDefault()
    var button = e.target
    var search = button.textContent
    coordsCall(search)
}
// This function renders the contents of the forecast container. 
function renderForecastContainer(daily) {

    forecastEl.innerHTML = ''
    var forecastHeading = document.createElement('h5')
    forecastHeading.setAttribute('id', 'forecastHeading')
    forecastHeading.textContent = `8-Day Forecast`



    // for (let i = 0; i < 7; i++) {
    //     const forecast = daily[i];
    //     renderForecastCard(forecast)
    // }
    daily.forEach((forecast) => { renderForecastCard(forecast) })
}
// This function renders each individual forecast card with the relevant data.
function renderForecastCard(forecast) {

    var tempMax = forecast.temp.max
    var tempMin = forecast.temp.min
    var humidity = forecast.humidity
    var weather = forecast.weather[0].main
    var iconURL = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`
    var iconAlt = forecast.weather[0].icon

    let card = document.createElement('div')
    let tempMinEl = document.createElement('p')
    let tempMaxEl = document.createElement('p')
    let weatherEl = document.createElement('p')
    let humidityEl = document.createElement('p')
    let iconEl = document.createElement('img')

    card.append(tempMaxEl, tempMinEl, weatherEl, iconEl, humidityEl)

    card.setAttribute('class', 'forecastCard')
    tempMaxEl.setAttribute('class', 'cardTemp')
    tempMinEl.setAttribute('class', 'cardTemp')
    weatherEl.setAttribute('class', 'cardWeather')
    humidityEl.setAttribute('class', 'cardHumidity')
    iconEl.setAttribute('class', 'cardIcon')

    iconEl.setAttribute('src', iconURL)
    iconEl.setAttribute('alt', iconAlt)

    tempMaxEl.textContent = `Max Temp: ${tempMax}º F`
    tempMinEl.textContent = `Min Temp: ${tempMin}º F`
    humidityEl.textContent = `Humidity: ${humidity}%`
    weatherEl.textContent = `Weather: ${weather}`
    forecastEl.append(card)
}
// This function renders the current weather
function renderCurrentContent(current, city) {
    currentEl.innerHTML = ''
    var temp = current.temp
    var feelsLike = current.feels_like
    var weather = current.weather[0].main
    var humidity = current.humidity
    var iconUrl = `https://openweathermap.org/img/w/${current.weather[0].icon}.png`
    var iconAlt = current.weather[0].description
    var uvi = current.temp

    let cityEl = document.createElement('h4')
    let tempEl = document.createElement('p')
    let feelsLikeEl = document.createElement('p')
    let weatherEl = document.createElement('p')
    let humidityEl = document.createElement('p')
    let iconEl = document.createElement('img')
    let uviEl = document.createElement('p')

    currentEl.append(cityEl, tempEl, feelsLikeEl, iconEl, weatherEl, humidityEl, uviEl)

    iconEl.setAttribute('src', iconUrl)
    iconEl.setAttribute('alt', iconAlt)

    cityEl.textContent = `Current Weather for ${city}`
    tempEl.textContent = `Temp: ${temp}ºF`
    feelsLikeEl.textContent = `Feels Like: ${feelsLike}º F`
    humidityEl.textContent = `Humidity: ${humidity}%`
    weatherEl.textContent = `Weather: ${weather}`
    uviEl.textContent = `UV Index: ${uvi}`


}
// This Function saves the most recent city input to local storage.
function saveSearch(location) {
    let searchHistory = JSON.parse(localStorage.getItem('WeatherAppHistory')) || []
    if (searchHistory.includes(location) === false) {
        searchHistory.push(location)
        console.log(searchHistory)
        localStorage.setItem('WeatherAppHistory', JSON.stringify(searchHistory))
    }
    renderSearchHistory()
}
// This function checks for local storage then renders whats listed
function renderSearchHistory() {
    recentSearchEl.innerHTML = ''
    var searchHistory = JSON.parse(localStorage.getItem('WeatherAppHistory')) || []
    for (let i = 0; i < searchHistory.length; i++) {
        var button = document.createElement('button');
        button.setAttribute('type', 'button')
        button.setAttribute('class', 'recent-search')
        button.setAttribute('data-recent', searchHistory[i])
        button.textContent = searchHistory[i];
        recentSearchEl.append(button)
    }
}
renderSearchHistory()
// These are the event listeners used. 
searchFormEl.addEventListener('submit', searchSubmitHandler)
recentSearchEl.addEventListener('click', recentClickHandler)