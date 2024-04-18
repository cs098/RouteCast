function displayInfo(point){
    const div = document.getElementById("weatherWindow")

  if (!point.dates || !point.tempList || !point.weatherList || !point.windList || !point.visList){
    return
  }

  const table = document.getElementById("table")
  table.innerHTML = "";

  var tr = document.createElement("tr")
  th = document.createElement("th")
  th.innerHTML = "Time"
  tr.appendChild(th)

  for(var i=0; i<point.dates.length; i++){
      th = document.createElement("th")
      var hour = point.dates[i].getHours()
      if(hour>12){hour-=12}
      var minutes = point.dates[i].getMinutes()
      if(minutes<10){minutes="0"+minutes}
      th.innerHTML = hour + ":" + minutes;
      tr.appendChild(th)
  }
  table.appendChild(tr)

  tr = document.createElement("tr")

  var td = document.createElement("td")
  td.innerHTML = "Temperature"
  tr.appendChild(td)

  for(var i=0; i<point.tempList.length; i++){
      const val = point.tempList[i]
      var colspan = 1;
      while(i+1 < point.tempList.length && Math.abs(point.tempList[i+1]-val) <= 3){
          colspan ++;
          i++;
      }
      td = document.createElement("td")
      td.colSpan = colspan
      td.innerHTML = val
      tr.appendChild(td)
  }
  table.appendChild(tr)

  tr = document.createElement("tr")

  td = document.createElement("td")
  td.innerHTML = "Weather"
  tr.appendChild(td)

  for(var i=0; i<point.weatherList.length; i++){
      const val = point.weatherList[i]
      var colspan = 1;
      while(i+1 < point.weatherList.length && point.weatherList[i+1] == val){
          colspan ++;
          i++;
      }
      td = document.createElement("td")
      td.colSpan = colspan
      td.innerHTML = val
      tr.appendChild(td)
  }
  table.appendChild(tr)

  tr = document.createElement("tr")

  td = document.createElement("td")
  td.innerHTML = "Wind Speed"
  tr.appendChild(td)

  for(var i=0; i<point.windList.length; i++){
      const val = point.windList[i]
      var colspan = 1;
      while(i+1 < point.windList.length && Math.abs(point.windList[i+1]-val) <= 2){
          colspan ++;
          i++;
      }
      td = document.createElement("td")
      td.colSpan = colspan
      td.innerHTML = val
      tr.appendChild(td)
  }
  table.appendChild(tr)

  tr = document.createElement("tr")

  td = document.createElement("td")
  td.innerHTML = "Visibility"
  tr.appendChild(td)
  
  for(var i=0; i<point.visList.length; i++){
      const val = point.visList[i]
      var colspan = 1;
      while(i+1 < point.visList.length && Math.abs(point.visList[i+1]-val) <= 1){
          colspan ++;
          i++;
      }
      td = document.createElement("td")
      td.colSpan = colspan
      td.innerHTML = val
      tr.appendChild(td)
  }
  table.appendChild(tr)

  div.style.display = "block"
}
