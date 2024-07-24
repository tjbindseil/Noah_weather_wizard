# Weather Wizard

## Shortest description
Find the best weather for the activities you love.

## Under the hood
What this means is that we need access to several (all?) weather reports for the different places we want to search.
In addition, we need a mechanism to determine where the weather is good or best.

### Locations
In the initial implementation, we listed a few mountains we were hoping to climb in out Sierra trip. Each location had
a name, latitude, and longitude. These were listed in a json file.

While the JSON file isn't super duper, the lat/long point and name seem ok to me at this point. That is the input into
the NOAA weather API. We can store these in a database as they seem pretty well suited for an RDS table. Then, if we want,
we can use do things like:
* search weather in all locations within a radius of a point
* group points according to their activity/acitvities
  * first thought is another table that has relationships between the locations and some kind of ativities table/enum
* users can select from the list of locations when doing their query

### Weather Forecast Data
In order to get the data and make the decision on where the weather is good/bad/ugly, we will be fetching data from the
Naurtional Weather Service. This requires us to request metadata for a lat/long point, and then that metadata will provide
URLs that will in turn provide the forecast. (A sequence diagram would probably help here...).

These APIs are rate limited, and the python POC would occasionally (ie inconsistantly and unrepeatably) fail. But, even if
these APIs weren't rate limited, we would still benefit from caching the data. In addition to caching any rate limiting
error should be gracefully handled

Ultimatly, each location (name/lat/long) will have a forecast and an hourly forecast.

#### Forecast
A forecast consists of periods that with a forecast. Each period is half a day, ie Tuesday, Tuesday Night, Wednesday, Wednesday
Night.

#### Hourly Forecast
a series of datapoints for time ranges that are an hour long.

Now, how do we store this info? Potentially another RDS table.
Refresh as needed?
Throw out the old data when we refresh

### Comparison Mechanism

#### Manual
The initial POC just displayed all the different areas. There were three displays: short forecast, detailed forecast, and icon forecast.
This was pretty effective and quick. And with the data aggregated correclty, it should be possible to create similar tables in addition to
displaying the hourly data of different locations in one table (not done yet).

#### Custom Sort Function

#### Custom Valid Function

#### Built in options for both of the above
