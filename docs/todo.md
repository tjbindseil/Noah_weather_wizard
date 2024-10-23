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



## user stuff
* get username back? - done
* quick test - done
* add username to spots - done
* which endpoints need validation?
  * delete
* integ tests
* feature where the user saves their favorite spots
* integ tests
* way to login on frontend
* save username with frontend requests for spot creation
* add page (or way) to manage favorite spots
* select spots, manage caching via a service ???


## frontend
* existing spots do not pop up initially - done (kinda, not sure how to handle ordering of useEffect fetching)
* upon creating a spot, all existing spots disappear (including the spot just made) - done
* highlight on map when a spot is selected
* forecast service integration
  * so, right now, we have a page that lets spots be checked
  * it might be easier if ... dd
* consider utilizing the permanence of spot service in coordination with the map to solve the repeated `fetch_existing_spot` calls returning out of order
* handle retry / wait stuff
  * retry in noaa api
  * display waiting until successful or unsuccessful
* spot selection page
  * search by name
  * center on a selected point
* integrate with backend
  * ultimately, this will require a user system
  * add new spot
  * save favorite spots
  * browse for new spots
    * select spots based on lat/long rectangle
    * search
    * view other individuals spots
  * select a handful of considerations
  * go to forecast page
* wire up forecast provider (just the one that gets them all, not filter or sort)
* forecast comparison page
* write up a forecast hourly model
* on a four hour interval, fetch forecast hourly for each polygon
* wire up forecast hourly provider (just the one that gets them all, not filter or sort)
* forecast hourly comparison page
