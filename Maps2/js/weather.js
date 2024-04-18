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

    const badStuffList = [1114,1117,1147,1192,1195,1201,1207,1225,1237,1243,1246,1252,1258,1261,1264,1276,1282,1222]
    const notibleStuffList =[1135,1168,1171,1183,1186,1189,1198,1204,1213,1216,1219,1222,1240,1249,1255,1273,1279]

    var isBad = false;
    let iconName = "Gw";

    if(notibleStuffList.includes(weatherCode) || temp <= 32 || wind>=20){
      isBad = true;
      iconName="Ns";
    }

    if (badStuffList.includes(weatherCode) || wind >= 25 || temp < 10){
      isBad = true;
      iconName="Bs";
        if (temp < 10) iconName += "Bf";
        if (wind >= 25) iconName += "Ws";
    }

    point.iconName = iconName;

    if(isBad){
      meteoInfo(point, ints)
    }

  } catch (error) {
    console.error("Error:" + error);
  }
  await new Promise(resolve => setTimeout(resolve, 200));
}

async function meteoInfo(point, ints) {

  const meteoDict = {0:"Clear Sky",1:"Mostly Clear",2:"Partly Cloudy",3:"Overcast",45:"Fog",48:"Freezing Fog",51:"Light Drizzle",53:"Moderate Drizzle",55:"Dense Drizzle",56:"Light Freezing Drizzle",57:"Dense Freezing Drizzle",61:"Slight Rain",63:"Moderate Rain",65:"Heavy Rain",66:"Light Freezing Rain",67:"Heavy Freezing Rain",71:"Slight Snow",73:"Moderate Snow",75:"Heavy Snow",77:"Snow Grains",80:"Slight Showers",81:"Moderate Showers",82:"Violent Showers",85:"Slight Snow Showers",86:"Heavy Snow Showers",95:"Thunderstorm",96:"Thunderstorm With Small Hail",99:"Thunderstorm With Heavy Hail",}

  let maxRange = -2;

  if (ints < 2) 
    maxRange -= ints;
  else maxRange = -4

  const urlData = `https://api.open-meteo.com/v1/forecast?latitude=${point.LatLng.lat()}&longitude=${point.LatLng.lng()}&minutely_15=temperature_2m,wind_speed_10m,visibility,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_minutely_15=${ints+2}`;

  try {
    const response = await fetch(urlData);
    const responseData = await response.json();

    console.log("past api call")

    var dates = [];
    for(let i=0; i>maxRange; i--){
        let date = addMinutes(new Date(), (ints+maxRange+2-i)*15);
        dates.push(date);
    }
    
    point.tempList = responseData.minutely_15.temperature_2m.slice(maxRange);
    point.windList = responseData.minutely_15.wind_speed_10m.slice(maxRange);
    point.visList = responseData.minutely_15.visibility.slice(maxRange);
    for (let i = 0; i < point.visList.length; i++) {
      point.visList[i] /= 5280;
    }
    var weatherList = responseData.minutely_15.weather_code.slice(maxRange);
    point.weatherList = []
    weatherList.forEach(item => {
      point.weatherList.push(meteoDict[item])
    })
    point.dates = dates;
    console.log(point)

  } catch (error) {
    console.error("Error:" + error);
    return [];
  }
}

function addMinutes(date, minutes) {
    if (!(date instanceof Date || !isNaN(date.getTime()))) {
      return; // return undefined if date is not a valid Date object
    }
    return new Date(date.getTime() + minutes*60000);
}
