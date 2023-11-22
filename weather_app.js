const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector('.weather-container');
const grantLocation = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('[data-searchForm]');
const loading = document.querySelector(".loading-container");
const userWeather = document.querySelector(".user-weather-container");
const wrapper = document.querySelector(".wrapper");
const notFound = document.querySelector('.not-found');

let currentTab = userTab;
const API_KEY = "43dcdfd4b3b379875e793757587f6ccb";
currentTab.classList.add("current-tab");
getfromSessionStorage(); 

function switchTab(clickedTab){
    if (clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
 
        if(!searchForm.classList.contains("active")){
            userWeather.classList.remove("active");
            grantLocation.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userWeather.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click" , ()=>{
    switchTab(userTab)
})

searchTab.addEventListener("click" , ()=>{
    switchTab(searchTab)
})

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantLocation.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;

    notFound.classList.remove("active");
    grantLocation.classList.remove("active");
    loading.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json(); 
        loading.classList.remove("active");
        if(!response.ok){ 
            throw new Error('HTTP Error!');
        }
        userWeather.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        notFound.classList.add("active");
    }
}

function renderWeatherInfo(weatherInfo){

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('browser does not support this');
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };

    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click" , getLocation);

let searchInput = document.querySelector('[data-searchInput]');
searchForm.addEventListener("submit" , (e)=>{
    e.preventDefault();
    if(searchInput.value === "") return;

    fetchSearchWeatherInfo(searchInput.value);
})

async function fetchSearchWeatherInfo(city){
    loading.classList.add("active");
    userWeather.classList.remove("active");
    grantLocation.classList.remove("active");
    notFound.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loading.classList.remove("active");
        if(!response.ok){
            throw new Error('HTTP Error!');
        }
        userWeather.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        notFound.classList.add("active");   
    }
}