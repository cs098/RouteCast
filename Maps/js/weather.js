async function weatherFunction(point, time) {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=d64b86a0b5be44fd9d3160958242901&q=${point.LatLng.lat()},${point.LatLng.lng()}&days=3`);
    const data = await response.json();

    const days = Math.floor(time/3600/24);
    const hours = Math.floor((time-days*3600*24)/3600);
    const hour = Math.round((time-days*3600*24)/3600);
    const remaining = Math.floor((time-days*3600*24-hours*3600)/60/15);
    const ints = days*96+hours*4+remaining;

    const temp = data.forecast.forecastday[days].hour[hour].temp_f;
    const wind = data.forecast.forecastday[days].hour[hour].wind_mph;
    const weatherCode = data.forecast.forecastday[days].hour[hour].condition.code;
    const weatherCodeName = data.forecast.forecastday[days].hour[hour].condition.text;
    const visibility = data.forecast.forecastday[days].hour[hour].vis_miles;

    const badStuffList = [
      1030, 1114, 1117, 1135, 1147, 1168, 1171, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1240, 1243, 1246, 1249, 1252, 1258, 1261, 1264, 1273, 1276, 1279, 1282
    ];

    var isBad = false;
    if (badStuffList.includes(weatherCode) || visibility <= 4 || wind >= 25 || temp < 10)
      isBad = true;

    let iconName = "";
    if (temp <= 32) iconName += "Bf";
    else iconName += "!Bf";
    if (wind >= 25) iconName += "Ws";
    else iconName += "!Ws";
    if (visibility <= 4) iconName += "Lv";
    else iconName += "!Lv";
    if (badStuffList.includes(weatherCode)) iconName += "Dw";
    else iconName += "!Dw";

    point.temp = temp;
    point.wind = wind;
    point.visibility = visibility;
    point.weatherCodeName = weatherCodeName;
    point.iconName = iconName;

    if(isBad)
        meteoInfo(point, ints)

  } catch (error) {
    console.error("Error:", error);
  }
}

async function meteoInfo(point, ints) {
  let maxRange = -2;

  if (ints < 2) 
    maxRange -= ints;
  else maxRange = -4

  const urlData = `https://api.open-meteo.com/v1/forecast?latitude=${point.LatLng.lat()}&longitude=${point.LatLng.lng()}&minutely_15=temperature_2m,wind_speed_10m,visibility,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_minutely_15=${ints+2}`;

  try {
    const response = await fetch(urlData);
    const responseData = await response.json();

    var dates = [];
    //addMinutes(Date(Date.now()), (ints+maxRange+2)*15);
    for(let i=0; i>maxRange; i--){
        let date = addMinutes(Date(Date.now()), (ints+maxRange+2-i)*15);
        dates.push(date);
    }

    point.tempList = responseData.minutely_15.temperature_2m.slice(maxRange);
    point.windList = responseData.minutely_15.wind_speed_10m.slice(maxRange);
    point.visList = responseData.minutely_15.visibility.slice(maxRange);
    point.weatherList = responseData.minutely_15.weather_code.slice(maxRange);
    point.dates = dates;

  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}
