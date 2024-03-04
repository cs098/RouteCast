import json
import requests

# -123,-23

lat = input("input latitude: ")
long = input("input longitude: ")
askhours = input(
    "For what hour today would you like to get the forecast for? ")

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
print("This forecast is for the county of " + data['location']['name'] +
      " in the state/area of " + data['location']['region'])
print("The temperature at", hours, "hours will be",
      data['forecast']['forecastday'][days]['hour'][int(hours)]['temp_f'], "F")
print("But it will feel like",
      data['forecast']['forecastday'][days]['hour'][int(hours)]['feelslike_f'],
      "F")
print("The wind speed will be",
      data['forecast']['forecastday'][days]['hour'][int(hours)]['wind_mph'],
      "mph")
print("The humidity will be",
      data['forecast']['forecastday'][days]['hour'][int(hours)]['humidity'],
      "%")
print("The cloud cover will be",
      data['forecast']['forecastday'][days]['hour'][int(hours)]['cloud'], "%")
print("The uv index will be",
      data['forecast']['forecastday'][days]['hour'][int(hours)]['uv'])
print(
    "the chance of raining will be", data['forecast']['forecastday'][days]
    ['hour'][int(hours)]['chance_of_rain'], "%")
print(
    "weather code is", data['forecast']['forecastday'][days]['hour'][int(
        hours)]['condition']['text'])
print(data['forecast']['forecastday'][days]['hour'][int(hours)]['vis_miles'])

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
    hours)]['condition']['text']
visibility = data['forecast']['forecastday'][days]['hour'][int(
    hours)]['vis_miles']

badstufflist = [
    'Mist', 'Patchy rain possible', 'Patchy snow possible',
    'Patchy sleet possible', 'Patchy freezing drizzle possible',
    'Thundery outbreaks', 'Blowing snow', 'Blizzard', 'Fog', 'Freezing fog',
    'Patchy light drizzle', 'Light drizzle', 'Freezing drizzle',
    'Heavy freezing drizzle', 'Patchy light rain', 'Light rain',
    'Moderate rain at times', 'Moderate rain', 'Heavy rain at times',
    'Heavy rain', 'Light freezing rain', 'Moderate or heavy freezing rain',
    'Light sleet', 'Moderate or heavy sleet', 'Patchy light snow',
    'Light snow', 'Patchy moderate snow', 'Moderate snow', 'Patchy heavy snow',
    'Heavy snow', 'Ice pellets', 'Light rain shower',
    'Moderate or heavy rain shower', 'Torrential rain shower',
    'Light sleet showers', 'Moderate or heavy sleet showers',
    'Light snow showers', 'Moderate or heavy snow showers',
    'Patchy light rain with thunder', 'Moderate or heavy snow with thunder'
]
print("now for the meteo stuff")
url_data=f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={long}&minutely_15=temperature_2m,wind_speed_10m,visibility,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_minutely_15=7"
responsemeteo=requests.get(url_data).json() #get data response in json
temperature_data = responsemeteo["minutely_15"]["temperature_2m"]
wind_speed_data = responsemeteo["minutely_15"]["wind_speed_10m"]
visibility_data = responsemeteo["minutely_15"]["visibility"]
weather_code_data = responsemeteo["minutely_15"]["weather_code"]
time_data = responsemeteo["minutely_15"]["time"]
print(temperature_data)
print(wind_speed_data)
print(visibility_data)
print(weather_code_data)
print(time_data)



if weathercode in badstufflist:
  if visibility < 5:
    print("It is bad weather")
else:
  print("It is not bad weather")
