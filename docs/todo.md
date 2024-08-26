* get `api` and `app_config` in their own modules
  * `app_config`
    * hmm, the actual configuration must live outside the module as the specifics aren't shared between apps.
    * how tho?


# app config
So, services depend on a configuration, and the configuration template is unique per app. But, the vendor of the template is consistent. so its not so straightforward.

## consistent
* vendor (`get_app_config`)
* envs (`enum Environment`);

## inconsistent
* template
* instances of template

## options
1. branches in the git repo (one branch per app)
2. the generalizee `app_config` package consumes a per app `app_config_template` package that vends a standardized name.
Its worth noting that this still requires a change to the package (changing `package.json` to consume the app specific template)
3. a pointer within the `AppConfig` definition.  Not sure this helps it just moves the problem.

I think I need to research a bit...
### Question
can i export a package as a different name (ie `dwf_app_config_template` gets packaged as `app_specific_template`.) If I can do this, the apps can share an unmodified
copy of `app_config` module as that can consume without knowing the templates are diffferent

#### Answer
`exports` field in package.json will allow for exporting with a different name (ie `my_app` vs `my_app/config_template`).

Is it as easy as having all template packages use the same name? yes, but only because I don't have them in a registry. Once they are in a registry this will break.
maybe these don't need to be in a registry?

what do i get out of a registry?


### Decision
.... wait till the question is answered

ultimately, since both require a change to the package

U

#### revisiting later
```
// so now, instead of the shared app_config module consuming the app specific configurations,
// the app specific configurations will consume this vending function, give it the app specific
// generic configuration map, and vend a non generic `get_app_config`
export const get_app_config_generic = <C>(appConfigMap: Map<string, C>) => {
  const env_var = process.env.TJB_ENV;
  if (!env_var) {
    throw new Error("TJB_ENV is not defined");
  }

  return appConfigMap.get(env_var);
};
```




## Forecast data fetching
* input to forecast apis needs to be spot ID - done
* change spot to ... spot? - done
* fetch polygonID as a part of spot posting - done
* save new polygons as part of spot posting - done
  * create s3 buckets, add to app_config - done
  * put forecast, forecastHourly, and polygon into s3 bucket, each prefixed with polygon ID - done
```
// bucket: ww-dev-forecasts
// key: /ABC/forecast.json or /ABC/forecastHourly.json or /ABC/shape.json
```
* ensure polygons are consistent - seems good, write something that verifies though - done
* write up forecast model - done
* create polygon table (just polygonID as pk and forecastURL) - done
* add row to polygon table when saving geometry - done
* move dbo to utilities
* on a four hour interval, fetch forecast for each polygon
  * this will require reuse in forecast_service of some of the utilities currently residing in spot_service, so move these to a lib - done
  * this will also require a piece of code that is not call and response, some kind of cron job thing, figure out this (setInterval())
  * what about locking? can we just use stale data?
    * well, the forecastUpdater will ... oh shoot! We have to save the forecast URL
    * anyway, this is just writing, and forecast provider will just read. and since actions are atomoic, this is fine
  * use setInterval to write a function that gets the next polygon/forecastURL in order, and gets the new data and saves it
    * the weird thing here, is how will it know of new polygons? maybe at the end of each cycle it can refresh. Since the forecast is fetched upon creating the new spot
* wire up forecast provider (just the one that gets them all, not filter or sort)
* write up a forecast hourly model
* on a four hour interval, fetch forecast hourly for each polygon
* wire up forecast hourly provider (just the one that gets them all, not filter or sort)
