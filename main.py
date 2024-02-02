import json
import requests

asklocation = input(
    "What is your location? Ex. -123,-23- or -Henrico- or -Henrico Virginia- ")
askhours = input(
    "For what hour today would you like to get the forecast for? ")

# Make a GET request to the URL
response = requests.get(
    'https://api.weatherapi.com/v1/forecast.json?key=d64b86a0b5be44fd9d3160958242901&q='
    + asklocation + '&hours=' + askhours + "&days=3")
# Get the JSON data from the response
data = response.json()
# Display the forecast info
# The [0] in the data is for the day. 0 is current day, 1 is tomorrow, 2 is day after tomorrow.
print("This forecast is for the county of " + data['location']['name'] +
      " in the state/area of " + data['location']['region'])
print("The temperature at", askhours, "hours will be",
      data['forecast']['forecastday'][0]['hour'][int(askhours)]['temp_f'], "F")
print("But it will feel like",
      data['forecast']['forecastday'][0]['hour'][int(askhours)]['feelslike_f'],
      "F")
print("The wind speed will be",
      data['forecast']['forecastday'][0]['hour'][int(askhours)]['wind_mph'],
      "mph")
print("The humidity will be",
      data['forecast']['forecastday'][0]['hour'][int(askhours)]['humidity'],
      "%")
print("The cloud cover will be",
      data['forecast']['forecastday'][0]['hour'][int(askhours)]['cloud'], "%")
print("The uv index will be",
      data['forecast']['forecastday'][0]['hour'][int(askhours)]['uv'])
print(
    "the chance of raining will be", data['forecast']['forecastday'][0]['hour']
    [int(askhours)]['chance_of_rain'], "%")
print(
"the temp tomorrow is", data['forecast']['forecastday'][1]['hour']
[int(askhours)]['temp_f'], "%")
