const APIROOT = 'https://api.openweathermap.org'
const APIKEY = '2af0ef1a0f66a04443807e8de444eb4d'

const searchFormEl = document.getElementById('citySearch')
const searchInputEl = document.getElementById('cityName')
const recentSearchEl = document.getElementById('recentSearch')
const currentEl = document.getElementById('currentContainer')
const forecastEl = document.getElementById('forecastContainer')

// TODO: Create forecast fetch function
function weatherCall(location) {
    var {lat, lon} = location
    var city = location.name
    var weatherUrl = `${APIROOT}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKEY}`
    console.log(weatherUrl)
    fetch(weatherUrl)
      .then((res)=>{ return res.json()})
      .then((data)=>{
         var {current, daily} = data
         renderForecastContainer(daily)
         renderCurrentContent(current, city)
      })
}
// TODO: Create coords fetch function
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
// TODO: Create event handlers  
// - Search Input Handler
function searchHandler(e) {
    if (!searchInputEl.value) {
        return alert('Please Enter A CityName');
    }
    e.preventDefault()
    var cityName = searchInputEl.value.trim();
    console.log(cityName)
    coordsCall(cityName)
    searchInputEl.value = ''
}
// - Recent search click handler 

// TODO: Render Forecast functions
function renderForecastContainer(daily){
    forecastEl.innerHTML = ''
    var forecastHeading = document.createElement('h5')
    forecastHeading.setAttribute('id','forecastHeading')
    forecastHeading.textContent = `5-Day Forecast`
    forecastEl.append(forecastHeading);
    daily.forEach((forecast)=>{renderForecastCard(forecast)})
}

function renderForecastCard(forecast){
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

    card.append(tempMaxEl,tempMinEl,iconEl,weatherEl,humidityEl)

    card.setAttribute('class','forecastCard')
    tempMaxEl.setAttribute('class','cardTemp')
    tempMinEl.setAttribute('class','cardTemp')
    weatherEl.setAttribute('class','cardWeather')
    humidityEl.setAttribute('class','cardHumidity')
    iconEl.setAttribute('class','cardIcon')

    iconEl.setAttribute('src',iconURL)
    iconEl.setAttribute('alt',iconAlt)

    tempMaxEl.textContent = `Max Temp: ${tempMax}º F`
    tempMinEl.textContent = `Min Temp: ${tempMin}º F`
    humidityEl.textContent = `Humidity: ${humidity}%`
    weatherEl.textContent = `Weather: ${weather}`
    forecastEl.append(card)
}
// TODO: Render Current function 
function renderCurrentContent(current, city) {
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

    currentEl.append(cityEl,tempEl,feelsLikeEl,iconEl,weatherEl,humidityEl,uviEl)

    iconEl.setAttribute('src',iconUrl)
    iconEl.setAttribute('alt',iconAlt)
    
    cityEl.textContent = `Current Weather for ${city}`
    tempEl.textContent = `Temp: ${temp}ºF`
    feelsLikeEl.textContent = `Feels Like: ${feelsLike}º F`
    humidityEl.textContent = `Humidity: ${humidity}%`
    weatherEl.textContent = `Weather: ${weather}`
    uviEl.textContent = `UV Index: ${uvi}`
    

}

// TODO: Create Save Recent Searches
function saveSearch(location){
 let searchHistory = JSON.parse(localStorage.getItem('WeatherAppHistory')) || []
 if(searchHistory.includes(location)===false){
     searchHistory.push(location)
     console.log(searchHistory)
     localStorage.setItem('WeatherAppHistory',JSON.stringify(searchHistory))
 } 
}

//  - Render all recent searches on load 
//  - Recent searchs can be clicked to be searched again 

searchFormEl.addEventListener('submit', searchHandler)

