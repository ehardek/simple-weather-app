const APIROOT = 'https://api.openweathermap.org'
const APIKEY = '2af0ef1a0f66a04443807e8de444eb4d'

const searchFormEl = document.getElementById('citySearch')
const searchInputEl = document.getElementById('cityName')
const recentSearchEl = document.getElementById('recentSearch')
const currentEl = document.getElementById('currentContainer')
const forecastEl = document.getElementById('forecastContainer')

// TODO: Create forecast fetch function
function weatherCall(lat, lon) {
    var weatherUrl = `${APIROOT}/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKEY}`
    console.log(weatherUrl)
    fetch(weatherUrl)
      .then((res)=>{ return res.json()})
      .then((data)=>{
          console.log(data)
      })
}
// TODO: Create coords fetch function
function coordsCall(city) {
    console.log(city)
    var coordsUrl = `${APIROOT}/geo/1.0/direct?q=${city},US&appid=${APIKEY}`
    console.log(coordsUrl)
    fetch(coordsUrl)
        .then((res) => { return res.json() })
        .then((data) => {
            if (!data) {
                alert('Your city was not found.')
            } else {
                console.log(data)
                let lat = data[0].lat
                let lon = data[0].lon
                weatherCall(lat,lon)
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
// TODO: Render Forecast function
// TODO: Render Current function 
// TODO: Create Save Recent Searches
//  - Render all recent searches on load 
//  - Recent searchs can be clicked to be searched again 

searchFormEl.addEventListener('submit', searchHandler)

