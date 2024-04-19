async function weatherFunction(point, time) {
  try {

    const ints = Math.floor(time/900)

    const meteoDict = {0:"Clear Sky",1:"Mostly Clear",2:"Partly Cloudy",3:"Overcast",45:"Fog",48:"Freezing Fog",51:"Light Drizzle",53:"Moderate Drizzle",55:"Dense Drizzle",56:"Light Freezing Drizzle",57:"Dense Freezing Drizzle",61:"Slight Rain",63:"Moderate Rain",65:"Heavy Rain",66:"Light Freezing Rain",67:"Heavy Freezing Rain",71:"Slight Snow",73:"Moderate Snow",75:"Heavy Snow",77:"Snow Grains",80:"Slight Showers",81:"Moderate Showers",82:"Violent Showers",85:"Slight Snow Showers",86:"Heavy Snow Showers",95:"Thunderstorm",96:"Thunderstorm With Small Hail",99:"Thunderstorm With Heavy Hail",}
    const badStuffList = [48, 55, 57, 63, 65, 67, 73, 75, 77, 81, 82, 85, 86, 95, 96, 99]
    const notibleStuffList = [45, 48, 51, 53, 56, 61, 66, 71, 80]

    let maxRange = -2;

    if (ints < 2) 
      maxRange -= ints;
    else maxRange = -4

    const urlData = `https://api.open-meteo.com/v1/forecast?latitude=${point.LatLng.lat()}&longitude=${point.LatLng.lng()}&minutely_15=temperature_2m,wind_speed_10m,visibility,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_minutely_15=${ints+2}`;

    const response = await fetch(urlData);
    const responseData = await response.json();

    const tempList = responseData.minutely_15.temperature_2m.slice(maxRange);
    const windList = responseData.minutely_15.wind_speed_10m.slice(maxRange);
    const visList = responseData.minutely_15.visibility.slice(maxRange);
    for (let i = 0; i < visList.length; i++) {
      visList[i] /= 5280;
      visList[i] = visList[i].toFixed(2)
    }

    const weatherList = responseData.minutely_15.weather_code.slice(maxRange);
    let iconName = "Gw";
    let warning = "";

    for (let i = 0; i < weatherList.length; i++) {
      const weatherCode = weatherList[i];
      if (notibleStuffList.includes(weatherCode)) {
        iconName = "Ns";
        warning = "Warning for " + data.forecast.forecastday[days].hour[hour].condition.text;
        break;
      }
    }

    for (let i = 0; i < weatherList.length; i++) {
      const weatherCode = weatherList[i];
      if (badStuffList.includes(weatherCode)) {
        iconName = "Bs";
        warning = "Warning for " + data.forecast.forecastday[days].hour[hour].condition.text;
        break;
      }
    }

    var tempBad = false;
    for (let i = 0; i < tempList.length; i++) {
      const temp = tempList[i];
      if (temp <= 10) {
        if (iconName === "Bs") {
          iconName += "Bf";
          warning += ", extremely low temperatures";
        } else {
          iconName = "BsBf";
          warning = "Warning for extremely low temperatures";
        }
        tempBad = true;
        break;
      }
    }

    if (!tempBad) {
      for (let i = 0; i < tempList.length; i++) {
        const temp = tempList[i];
        if (temp <= 32 && temp > 10) {
          if (iconName === "") {
            iconName = "Ns";
            warning = "Warning for temperatures below freezing";
          } else {
            warning += ", temperatures below freezing";
          }
          break;
        }
      }
    }

    var windBad = false;
    for (let i = 0; i < windList.length; i++) {
      const wind = windList[i];
      if (wind >= 25) {
        if (iconName === "Bs" || iconName === "BsBf") {
          iconName += "Ws";
          warning += ", extremely high wind speeds";
        } else if (iconName === "Ns") {
          iconName = "BsWs";
          warning += ", extremely high wind speeds";
        } else {
          iconName = "BsWs";
          warning = "Warning for extremely high wind speeds";
        }
        windBad = true;
        break;
      }
    }

    if (!windBad) {
      for (let i = 0; i < windList.length; i++) {
        const wind = windList[i];
        if (wind < 25 && wind >= 18) {
          if (iconName === "") {
            iconName = "Ns";
            warning = "Warning for high wind speeds";
          } else {
            warning += ", high wind speeds";
          }
          break;
        }
      }
    }

    var visBad = false;
    for (let i = 0; i < visList.length; i++) {
      const vis = visList[i];
      if (vis < 3) {
        if (iconName === "") {
          iconName = "BsLv";
          warning = "Warning for extremely low visibility";
        } else if (iconName === "Ns") {
          iconName = "BsLv";
          warning += ", extremely low visibility";
        } else {
          iconName += "Lv";
          warning += ", extremely low visibility";
        }
        visBad = true;
        break;
      }
    }

    if (!visBad) {
      for (let i = 0; i < visList.length; i++) {
        const vis = visList[i];
        if (vis <= 32 && vis > 10) {
          if (iconName === "") {
            iconName = "Ns";
            warning = "Warning for temperatures below freezing";
          } else {
            warning += ", temperatures below freezing";
          }
          break;
        }
      }
    }

    if (iconName !== "") {
      var dates = [];
      for (let i = 0; i > maxRange; i--) {
        let date = addMinutes(new Date(), (ints + maxRange + 2 - i) * 15);
        dates.push(date);
      }
      point.dates = dates;
      point.weatherList = weatherList;
      point.tempList = tempList;
      point.windList = windList;
      point.visList = visList;
    }

    point.iconName = iconName;
    point.warning = warning;

  } catch (error) {
    console.error("Error:" + error);
  }
  await new Promise(resolve => setTimeout(resolve, 200));
}

function addMinutes(date, minutes) {
    if (!(date instanceof Date || !isNaN(date.getTime()))) {
      return; // return undefined if date is not a valid Date object
    }
    return new Date(date.getTime() + minutes*60000);
}
