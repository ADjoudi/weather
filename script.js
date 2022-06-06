let dataFetched, record;
async function getWeatherData(city) {
  try {
    let fullInfo = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=33235756f460c3e188b6da24a7a5a778`,
      { mode: "cors" }
    );
    let data = await fullInfo.json();
    console.log(data);
    data = {
      name: data.name,
      temp: data.main.temp,
      state: data.weather[0].description,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind: data.wind.speed,
    };
    record = Object.assign({}, data);
    dataFetched = data;
    useMetric(dataFetched);
  } catch (e) {
    console.log(e);
  }
}
function useMetric(data) {
  data.temp = Math.round((record.temp - 273.15 + Number.EPSILON) * 100) / 100; //from kelvin to celsius formula
  data.wind = Math.round((record.wind * 3.6 + Number.EPSILON) * 100) / 100; // m/s to km/h
  updateUI(data, "metric");
}

function useImperial(data) {
  data.temp =
    Math.round((((record.temp - 273.15) * 9) / 5 + 32 + Number.EPSILON) * 100) /
    100; //from kelvin to F formula
  data.wind = Math.round((record.wind * 2.237 + Number.EPSILON) * 100) / 100; // m/s to mph
  updateUI(data, "imperial");
}
function updateUI(data, unit) {
  console.log(dataFetched);
  console.log(record);
  const name = document.querySelector("#name");
  const temp = document.querySelector("#temp");
  const state = document.querySelector("#state");
  const humidity = document.querySelector("#humidity");
  const pressure = document.querySelector("#pressure");
  const wind = document.querySelector("#wind");

  name.textContent = data.name;
  state.textContent = data.state;
  humidity.textContent = data.humidity + " %";
  pressure.textContent = data.pressure;
  if (unit == "metric") {
    temp.textContent = data.temp + " °C";
    wind.textContent = data.wind + " km/h";
  }
  if (unit == "imperial") {
    temp.textContent = data.temp + " °F";
    wind.textContent = data.wind + " mph";
  }
}

function updateDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + " - " + dd + " - " + yyyy;
  return today;
}

const switchBtn = document.querySelector("#switchBtn");
switchBtn.addEventListener("click", () => {
  console.log(switchBtn.textContent);
  if (switchBtn.textContent == "Switch to °F") {
    switchBtn.textContent = "Switch to °C";
    useImperial(dataFetched);
    return;
  }
  if (switchBtn.textContent == "Switch to °C") {
    switchBtn.textContent = "Switch to °F";
    useMetric(dataFetched);
    return;
  }
});

const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searched");
searchBtn.addEventListener("click", () => {
  if (searchInput.value) {
    switchBtn.textContent = "Switch to °F";
    getWeatherData(searchInput.value);
  }
});

const date = document.querySelector("#date");
date.textContent = updateDate();

getWeatherData("london");
