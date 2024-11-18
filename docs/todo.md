## api
* handle retry / wait stuff
  * retry in noaa api

## user stuff
* select spots, manage caching via a service ???
* private spots
* deal with multiplicity of spots

## forecast service
* write up a forecast hourly model
* on a four hour interval, fetch forecast hourly for each polygon
* wire up forecast hourly provider (just the one that gets them all, not filter or sort)
* forecast hourly comparison page
* remove or implement possible / ranked forecast

## tests
* create a canary to make sure that the forecast fetcher is running once an hour
* unit tests for handlers
* integ test script can check if the services are running on machine (check the port), if not present, start and stop as part of the script

## frontend
* consider utilizing the permanence of spot service in coordination with the map to solve
  the repeated `fetch\_existing\_spot` calls returning out of order (see user\_stuff abvoe)
* implement show (select?) favorites button in spot selection page (small)
* display waiting until successful or unsuccessful
* spot selection page search by name

## Going live...
* free secrets manager
* pm2 autoreload
* firewall
* ssl (certbot)
* organize build.sh, isntall.sh, and initial\_ec2\_script a little better
* docker might be better than trying to make it happen with just bash

### Docker idea
not going to do this quite yet since what i have is working i believe
* each service runs in a container
* all non service modules are build in a single container, that is referenced by each of the services (I think this is called a docker layer)
* nginx runs in a docker
* all relevant docker images are built and stored in a docker repo (ecr free tier?)
* prod machine must just be setup with docker capabilities
