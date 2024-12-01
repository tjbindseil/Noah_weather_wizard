## api

## user stuff
* private spots
* deal with multiplicity of spots

## forecast service
* remove or implement possible / ranked forecast

## tests
* create a canary to make sure that the forecast fetcher is running once an hour
* unit tests for handlers
* integ test script can check if the services are running on machine (check the port), if not present, start and stop as part of the script
* frontend tests

## frontend
* implement show (select?) favorites button in spot selection page (small)
* display waiting until successful or unsuccessful
* spot selection page search by name
* stop user from making spots without names
* validate responses from backend (this requires importing api which automatically runs `get_app_config` without the react env var explicitly given, which crashes)

## Going live...
* free secrets manager
* more than one cognito pool
* pm2 autoreload
* firewall
* specific user to run app
* deploy frontend
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
