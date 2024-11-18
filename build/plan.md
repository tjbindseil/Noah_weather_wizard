# Build and deploy
So, right now things are kind of a mess, but the backend can deploy on ec2 and pass integ tests, thats sweet.

What would be next?

Well, some low hanging fruit is the fact that i have to disable the db tests to build. This leads me to believe that
we should avoid the connection to the actual postgresql db and just use sqllite db.

## TODO items
* sqllite db tests
  * that's a pain, the databse is tightly coupled to a postgres client
  * so how else could i build on the prod machine?
    1. build with no tests
    2. db unit tests only run once in a while
    3. dev env

## take a step back
how do i work on this project?

1. modify stuff in a service or library
2. run unit tests for that piece if library, integ tests if service

how do i want to work on things?

* always have a dev env on ec2
* always have a prod env on ec2
* can run a host env on my machine

  &&&& DO I WANNA USE DOCKER?? &&&&
  first lets not

ok, so what about when i make a change?

idk about all this thinking, whats next?

this database test issue is tough, maybe only test it in dev?

or maybe, I just run a small postrges db

I concluded this with creating a psql docker container,
starting it, testing db code, stopping it

## Staging in addition to prod
Ok, I actually have an awesome prod env going!
but, I would like to do things pointing to the env outside my
laptop, and that could disrupt the production envitornment. So,
we need a staging env.

so here are the three environements
### Dev
frontend url: localhost:3000
backend urls: spot => localhost:8080 , forecast => localhost:8081 , user => localhost:8082 
docker unit testing: see `app_config`, currently just used to test the db and s3 adapter and noaa

### Staging
frontend url: `$PROD_IP_OR_HOST:4443` (TODO ssl, get domain name and do DNS stuff)
backend urls: all go to `$PROD_IP_OR_HOST:8888` , then are reverse proxied to: spot => localhost:8880 , forecast => localhost:8881 , user => localhost:8882 
docker unit testing: see `app_config`, currently just used to test the db and s3 adapter and noaa

### Prod
frontend url: `$PROD_IP_OR_HOST:443` (TODO ssl, get domain name and do DNS stuff)
backend urls: all go to `$PROD_IP_OR_HOST:80` , then are reverse proxied to: spot => localhost:8080 , forecast => localhost:8081 , user => localhost:8082 
docker unit testing: see `app_config`, currently just used to test the db and s3 adapter and noaa

## automation
gonna take stuff from the legendary `build.sh` file and make it a little better

### initialize up the ec2 instance

#### just off the top of my head
`sudo dnf update`
`sudo dnf upgrade`
* install git
  * `sudo dnf install git`
* clone into `ww_staging`
  * `git clone https://github.com/tjbindseil/Noah_weather_wizard.git ww_staging`
* clone into `ww_prod`
  * `git clone https://github.com/tjbindseil/Noah_weather_wizard.git ww_prod`
* install nvm
  * `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
* use node 18
  * `nvm install 18`
* install postgres
  * `sudo yum install postgresql15`
* install docker
  * `sudo dnf install docker`
  * `sudo systemctl start docker`
  * `sudo systemctl enable docker`
  * `sudo usermod -aG docker $USER`
  * `newgrp docker`
* create postgres docker container
  * `docker pull postgres`
  * `docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=ww-docker-unit-test -d -p 5432:5432 postgres`
* add tables to this container's db
  * `export WW_ENV='docker_unit_test' && node -e 'require("./build/src/index.js").initializeTables()'`
  * `docker stop my-postgres`
* install nginx
  * `sudo dnf install nginx`
* update nginx
  * see nginx additions section below
* start and enable nginx
  * `sudo systemctl start nginx`
  * `sudo systemctl enable nginx`


### build the code

#### just off the top of my head
* install.sh
* build.sh

### start the service
Note: I need two different files to run the environments twice
* `pm2 start pm2_ecosystem_file.prod.config.js`
* `pm2 start pm2_ecosystem_file.staging.config.js`


## TODO
* how to limit the cpu usage of node?
  * `npm set maxsockets 1`
  * `export NODE_OPTIONS="--max-old-space-size=512"`
* users specific for building and running staging and prod
* firewall
* local secrets manager
* use sites enabled / available to make nginx work
* automate docker installation on new machine


-r api.ts context_controllers.ts loosely_authenticated_api.ts strictly_authenticated_api.ts api_error.ts middleware/ validate.ts auth.ts job.ts queue.ts wait.ts
