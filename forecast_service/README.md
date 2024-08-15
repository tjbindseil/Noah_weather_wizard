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

## What is the mechanism that will wait 5 seconds when a call fails in order to let NOAA timeout happen?

## What does the forecast model look like?
