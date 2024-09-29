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




## frontend
* start frontend (gonna be sick)
* integ tests - done
* nav bar - done
* map integration
  * topo map instead of open street
  * for now, we will just do front end
    * add spot to map and list via input box - done
    * add spot to map and list via clicking on the map - done
    * show list of added spots (ie zoom to fit all spots) - done
    * highlight on map when a spot is selected
    * remove spot from list - done
    * go to forecast page - punt because this requires spots to be saved
  * ad hoc spots?
    * hmm, as of now, there is only a way to get forecast for a spot if it is saved
    * so, with the above in place i need to either:
      A) save the spots implicitly before requesting forecast
      B) force the user to save them before requesting
    * this begs the question of what is the reason for saving the spots?
      * I guess spots are saved so that they can be browsed
    * for now, I will go with option A, lets get something working for god's sake
    * NO!
  * spot creation page
    * operates one spot at a time
    * can either enter lat/long/name via text input or clicking on a map
    * can save or cancel
    * once saved (api call), the spot clears
    * once cleared, the spot clears
  * spot selection page
    * search by name
    * center on a selected point
    * zoom in/out
    * populate map with spots
    * select spots, they get added to some list, the list has a GET FORECAST button
  * forecast page
    * can't navigate here without selected spots (ie remove from nav bar)
    * take welected spots, send ids to api, get forecasts and display
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
