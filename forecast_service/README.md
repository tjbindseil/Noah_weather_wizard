# Forecast Service
You guessed it, this service gets forecast data.

What is interesting (and currently undecided), is the details of this.

## What is the API?

* `getForecast(list<pair<real, real>>): List<ForecastModel>`
* `getPossibleForecast(list<pair<real, real>>, criteria): List<ForecastModel>`
* `getRankedForecast(list<pair<real, real>>, formula): list<ForecastModel>`
* `getForecastHourly(list<pair<real, real>>): List<ForecastModelHourly>`
* `getPossibleForecastHourly(list<pair<real, real>>, criteria): List<ForecastModelHourly>`
* `getRankedForecastHourly(list<pair<real, real>>, formula): List<ForecastModelHourly>`

The forecast model will be returned. See below. There are two obvious options here:

### Location ID
### Latitude, Longitude

### Answer Why not both??
The draw back to both is the duplicity of API classes that need to be made.
The should be quick and just have the location ID version all call location service to get the lat/long, then call in to the lat/long apis
composition
but, even better, not using
just have the location be passed as a struct, its not that big

so, i guess the answer is lat/long

while im at it, why not have "`*Best*`" calls be subsumed by ranked calls? These will also need to include a formula

(for posterity, the following calls were removed):
* `getBestForecast(list<pair<real, real>>): ForecastModelHourly`
* `getBestForecastHourly(list<pair<real, real>>): ForecastModelHourly`

## What is the caching mechanism? (I guess its been deciced that a cache mechanism is needed)
### When to update?
I think I will initially use the same strategy that mountain forecast does.
It has a set refresh cadence, and shows this on the display. Once this has happened, in an orderly fashion (see timeout details below),
we will refresh the forecast data from NOAA

considerations for this:
* when does NOAA update? Best to be no faster than that

### Where to store data?
RDS

## What is the mechanism that will wait 5 seconds when a call fails in order to let NOAA timeout happen?
wrap the fetch calls to noaa in a class that encapsulates the waiting

## What does the forecast model look like?
### Request:
```
curl https://api.weather.gov/points/40.255,-105.6151

```

### Response:
```
{
    "@context": [
        "https://geojson.org/geojson-ld/geojson-context.jsonld",
        {
            "@version": "1.1",
            "wx": "https://api.weather.gov/ontology#",
            "s": "https://schema.org/",
            "geo": "http://www.opengis.net/ont/geosparql#",
            "unit": "http://codes.wmo.int/common/unit/",
            "@vocab": "https://api.weather.gov/ontology#",
            "geometry": {
                "@id": "s:GeoCoordinates",
                "@type": "geo:wktLiteral"
            },
            "city": "s:addressLocality",
            "state": "s:addressRegion",
            "distance": {
                "@id": "s:Distance",
                "@type": "s:QuantitativeValue"
            },
            "bearing": {
                "@type": "s:QuantitativeValue"
            },
            "value": {
                "@id": "s:value"
            },
            "unitCode": {
                "@id": "s:unitCode",
                "@type": "@id"
            },
            "forecastOffice": {
                "@type": "@id"
            },
            "forecastGridData": {
                "@type": "@id"
            },
            "publicZone": {
                "@type": "@id"
            },
            "county": {
                "@type": "@id"
            }
        }
    ],
    "id": "https://api.weather.gov/points/40.255,-105.6151",
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [
            -105.6151,
            40.255000000000003
        ]
    },
    "properties": {
        "@id": "https://api.weather.gov/points/40.255,-105.6151",
        "@type": "wx:Point",
        "cwa": "BOU",
        "forecastOffice": "https://api.weather.gov/offices/BOU",
        "gridId": "BOU",
        "gridX": 43,
        "gridY": 87,
        "forecast": "https://api.weather.gov/gridpoints/BOU/43,87/forecast",
        "forecastHourly": "https://api.weather.gov/gridpoints/BOU/43,87/forecast/hourly",
        "forecastGridData": "https://api.weather.gov/gridpoints/BOU/43,87",
        "observationStations": "https://api.weather.gov/gridpoints/BOU/43,87/stations",
        "relativeLocation": {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -105.5179859,
                    40.231281000000003
                ]
            },
            "properties": {
                "city": "Allenspark",
                "state": "CO",
                "distance": {
                    "unitCode": "wmoUnit:m",
                    "value": 8654.3585882591997
                },
                "bearing": {
                    "unitCode": "wmoUnit:degree_(angle)",
                    "value": 287
                }
            }
        },
        "forecastZone": "https://api.weather.gov/zones/forecast/COZ033",
        "county": "https://api.weather.gov/zones/county/COC013",
        "fireWeatherZone": "https://api.weather.gov/zones/fire/COZ218",
        "timeZone": "America/Denver",
        "radarStation": "KFTG"
    }
}
```

then:

### Second Request
```
curl https://api.weather.gov/gridpoints/BOU/43,87/forecast
```

### Second Response
```
{
    "@context": [
        "https://geojson.org/geojson-ld/geojson-context.jsonld",
        {
            "@version": "1.1",
            "wx": "https://api.weather.gov/ontology#",
            "geo": "http://www.opengis.net/ont/geosparql#",
            "unit": "http://codes.wmo.int/common/unit/",
            "@vocab": "https://api.weather.gov/ontology#"
        }
    ],
    "type": "Feature",
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [
                    -105.6348022,
                    40.275825400000002
                ],
                [
                    -105.6325437,
                    40.253898100000001
                ],
                [
                    -105.6038373,
                    40.2556175
                ],
                [
                    -105.60608979999999,
                    40.277544999999996
                ],
                [
                    -105.6348022,
                    40.275825400000002
                ]
            ]
        ]
    },
    "properties": {
        "units": "us",
        "forecastGenerator": "BaselineForecastGenerator",
        "generatedAt": "2024-08-15T02:16:36+00:00",
        "updateTime": "2024-08-15T01:36:30+00:00",
        "validTimes": "2024-08-14T19:00:00+00:00/P7DT9H",
        "elevation": {
            "unitCode": "wmoUnit:m",
            "value": 3962.0952000000002
        },
        "periods": [
            {
                "number": 1,
                "name": "Tonight",
                "startTime": "2024-08-14T20:00:00-06:00",
                "endTime": "2024-08-15T06:00:00-06:00",
                "isDaytime": false,
                "temperature": 37,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": 40
                },
                "windSpeed": "18 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/night/snow,40/snow,20?size=medium",
                "shortForecast": "Slight Chance T-storms",
                "detailedForecast": "A chance of showers and thunderstorms before 9pm, then a slight chance of thunderstorms and a chance of rain and snow showers between 9pm and 2am. Partly cloudy, with a low around 37. West wind around 18 mph, with gusts as high as 30 mph. Chance of precipitation is 40%. New rainfall amounts between a tenth and quarter of an inch possible."
            },
            {
                "number": 2,
                "name": "Thursday",
                "startTime": "2024-08-15T06:00:00-06:00",
                "endTime": "2024-08-15T18:00:00-06:00",
                "isDaytime": true,
                "temperature": 50,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": 20
                },
                "windSpeed": "9 to 18 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/day/few/tsra_hi,20?size=medium",
                "shortForecast": "Sunny then Slight Chance Showers And Thunderstorms",
                "detailedForecast": "A slight chance of showers and thunderstorms after noon. Sunny, with a high near 50. West wind 9 to 18 mph, with gusts as high as 30 mph. Chance of precipitation is 20%. New rainfall amounts less than a tenth of an inch possible."
            },
            {
                "number": 3,
                "name": "Thursday Night",
                "startTime": "2024-08-15T18:00:00-06:00",
                "endTime": "2024-08-16T06:00:00-06:00",
                "isDaytime": false,
                "temperature": 41,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": 30
                },
                "windSpeed": "8 to 16 mph",
                "windDirection": "WSW",
                "icon": "https://api.weather.gov/icons/land/night/tsra_hi,30/few?size=medium",
                "shortForecast": "Chance Showers And Thunderstorms then Mostly Clear",
                "detailedForecast": "A chance of showers and thunderstorms before 9pm, then a chance of showers and thunderstorms between 9pm and midnight. Mostly clear, with a low around 41. West southwest wind 8 to 16 mph, with gusts as high as 25 mph. Chance of precipitation is 30%."
            },
            {
                "number": 4,
                "name": "Friday",
                "startTime": "2024-08-16T06:00:00-06:00",
                "endTime": "2024-08-16T18:00:00-06:00",
                "isDaytime": true,
                "temperature": 55,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": 20
                },
                "windSpeed": "16 to 20 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/day/few/tsra_hi,20?size=medium",
                "shortForecast": "Sunny then Slight Chance Showers And Thunderstorms",
                "detailedForecast": "A slight chance of showers and thunderstorms after noon. Sunny, with a high near 55. West wind 16 to 20 mph, with gusts as high as 30 mph. Chance of precipitation is 20%."
            },
            {
                "number": 5,
                "name": "Friday Night",
                "startTime": "2024-08-16T18:00:00-06:00",
                "endTime": "2024-08-17T06:00:00-06:00",
                "isDaytime": false,
                "temperature": 43,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": null
                },
                "windSpeed": "14 to 22 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/night/wind_few?size=medium",
                "shortForecast": "Mostly Clear",
                "detailedForecast": "Mostly clear, with a low around 43. West wind 14 to 22 mph, with gusts as high as 26 mph."
            },
            {
                "number": 6,
                "name": "Saturday",
                "startTime": "2024-08-17T06:00:00-06:00",
                "endTime": "2024-08-17T18:00:00-06:00",
                "isDaytime": true,
                "temperature": 57,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": 20
                },
                "windSpeed": "14 to 22 mph",
                "windDirection": "WSW",
                "icon": "https://api.weather.gov/icons/land/day/wind_few/tsra_hi,20?size=medium",
                "shortForecast": "Sunny then Slight Chance Showers And Thunderstorms",
                "detailedForecast": "A slight chance of showers and thunderstorms after noon. Sunny, with a high near 57. Chance of precipitation is 20%."
            },
            {
                "number": 7,
                "name": "Saturday Night",
                "startTime": "2024-08-17T18:00:00-06:00",
                "endTime": "2024-08-18T06:00:00-06:00",
                "isDaytime": false,
                "temperature": 45,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": 20
                },
                "windSpeed": "14 to 17 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/night/tsra_hi,20/sct?size=medium",
                "shortForecast": "Slight Chance Showers And Thunderstorms then Partly Cloudy",
                "detailedForecast": "A slight chance of showers and thunderstorms before midnight. Partly cloudy, with a low around 45. Chance of precipitation is 20%."
            },
            {
                "number": 8,
                "name": "Sunday",
                "startTime": "2024-08-18T06:00:00-06:00",
                "endTime": "2024-08-18T18:00:00-06:00",
                "isDaytime": true,
                "temperature": 54,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": null
                },
                "windSpeed": "12 to 18 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/day/bkn/tsra_sct?size=medium",
                "shortForecast": "Mostly Cloudy then Showers And Thunderstorms Likely",
                "detailedForecast": "Showers and thunderstorms likely after noon. Mostly cloudy, with a high near 54."
            },
            {
                "number": 9,
                "name": "Sunday Night",
                "startTime": "2024-08-18T18:00:00-06:00",
                "endTime": "2024-08-19T06:00:00-06:00",
                "isDaytime": false,
                "temperature": 44,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": null
                },
                "windSpeed": "12 to 16 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/night/tsra_hi/bkn?size=medium",
                "shortForecast": "Chance Showers And Thunderstorms then Mostly Cloudy",
                "detailedForecast": "A chance of showers and thunderstorms before midnight. Mostly cloudy, with a low around 44."
            },
            {
                "number": 10,
                "name": "Monday",
                "startTime": "2024-08-19T06:00:00-06:00",
                "endTime": "2024-08-19T18:00:00-06:00",
                "isDaytime": true,
                "temperature": 53,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": null
                },
                "windSpeed": "12 to 17 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/day/rain_showers/tsra_sct?size=medium",
                "shortForecast": "Showers And Thunderstorms Likely",
                "detailedForecast": "A slight chance of rain showers before noon, then showers and thunderstorms likely. Partly sunny, with a high near 53."
            },
            {
                "number": 11,
                "name": "Monday Night",
                "startTime": "2024-08-19T18:00:00-06:00",
                "endTime": "2024-08-20T06:00:00-06:00",
                "isDaytime": false,
                "temperature": 43,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": null
                },
                "windSpeed": "12 to 17 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/night/tsra_hi/sct?size=medium",
                "shortForecast": "Chance Showers And Thunderstorms then Partly Cloudy",
                "detailedForecast": "A chance of showers and thunderstorms before midnight. Partly cloudy, with a low around 43."
            },
            {
                "number": 12,
                "name": "Tuesday",
                "startTime": "2024-08-20T06:00:00-06:00",
                "endTime": "2024-08-20T18:00:00-06:00",
                "isDaytime": true,
                "temperature": 53,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": null
                },
                "windSpeed": "14 to 20 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/day/rain_showers/tsra_hi?size=medium",
                "shortForecast": "Showers And Thunderstorms Likely",
                "detailedForecast": "A slight chance of rain showers before noon, then showers and thunderstorms likely. Mostly sunny, with a high near 53."
            },
            {
                "number": 13,
                "name": "Tuesday Night",
                "startTime": "2024-08-20T18:00:00-06:00",
                "endTime": "2024-08-21T06:00:00-06:00",
                "isDaytime": false,
                "temperature": 43,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": null
                },
                "windSpeed": "13 to 17 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/night/tsra_hi/sct?size=medium",
                "shortForecast": "Chance Showers And Thunderstorms then Partly Cloudy",
                "detailedForecast": "A chance of showers and thunderstorms before midnight. Partly cloudy, with a low around 43."
            },
            {
                "number": 14,
                "name": "Wednesday",
                "startTime": "2024-08-21T06:00:00-06:00",
                "endTime": "2024-08-21T18:00:00-06:00",
                "isDaytime": true,
                "temperature": 53,
                "temperatureUnit": "F",
                "temperatureTrend": "",
                "probabilityOfPrecipitation": {
                    "unitCode": "wmoUnit:percent",
                    "value": null
                },
                "windSpeed": "14 to 18 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/day/sct/tsra_hi?size=medium",
                "shortForecast": "Mostly Sunny then Showers And Thunderstorms Likely",
                "detailedForecast": "Showers and thunderstorms likely after noon. Mostly sunny, with a high near 53."
            }
        ]
    }
}
```
