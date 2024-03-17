import requests


# -123,-23
def weather_function(lat, long, askhours):
  
  #lat = input("input latitude: ")
  #long = input("input longitude: ")
  #askhours = input("For what hour today would you like to get the forecast for? ")
  
  # Make a GET request to the URL
  response = requests.get(
      'https://api.weatherapi.com/v1/forecast.json?key=d64b86a0b5be44fd9d3160958242901&q='
      + lat + ", " + long + "&days=3")
  # Get the JSON data from the response
  data = response.json()
  # Display the forecast info
  # The [0] in the data is for the day. 0 is current day, 1 is tomorrow, 2 is day after tomorrow.
  days = int(int(askhours) / 24)
  hours = int(askhours) % 24
  
  temp = data['forecast']['forecastday'][days]['hour'][int(hours)]['temp_f']
  tempfeellike = data['forecast']['forecastday'][days]['hour'][int(
      hours)]['feelslike_f']
  wind = data['forecast']['forecastday'][days]['hour'][int(hours)]['wind_mph']
  humidity = data['forecast']['forecastday'][days]['hour'][int(
      hours)]['humidity']
  cloudcover = data['forecast']['forecastday'][days]['hour'][int(hours)]['cloud']
  uvindex = data['forecast']['forecastday'][days]['hour'][int(hours)]['uv']
  rainchance = data['forecast']['forecastday'][days]['hour'][int(
      hours)]['chance_of_rain']
  weathercode = data['forecast']['forecastday'][days]['hour'][int(
      hours)]['condition']['code']
  weathercodename = data['forecast']['forecastday'][days]['hour'][int(
    hours)]['condition']['text']
  visibility = data['forecast']['forecastday'][days]['hour'][int(
      hours)]['vis_miles']
  
  badstufflist = [
    1030, 1114, 1117, 1135, 1147, 1168, 1171, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1240, 1243, 1246, 1249, 1252, 1258, 1261, 1264, 1273, 1276, 1279, 1282  
  ]
  #print("now for the meteo stuff")
  
  isBad = False
  if weathercode in badstufflist or visibility <= 4 or wind > 35 or temp < 10:
    print("It is bad weather")
    isBad = True
  else:
    print("It is not bad weather")
    isBad = False

  #Outputs the icon code
  iconname = ""
  if temp <= 32:
    iconname = iconname + "Bf"
  else :
    iconname = iconname + "!Bf"
  if wind > 35:
    iconname = iconname + "Ws"
  else :
    iconname = iconname + "!Ws"
  if visibility <= 4:
    iconname = iconname + "Lv"
  else :
    iconname = iconname + "!Lv"
  if isBad == True:
    iconname = iconname + "Dw"
  else :
    iconname = iconname + "!Dw"
  
  mylist = []
  mylist.insert(0,temp)
  mylist.insert(1,visibility)
  mylist.append(weathercodename)
  mylist.insert(3,wind)
  mylist.insert(4,iconname)
  return mylist
xxx = weather_function("32", "32", 11)
print(xxx)
#BfWsLvDw Bf= below freezing, Ws= wind speed, Lv= Low visability, Dw= dangourus weather

