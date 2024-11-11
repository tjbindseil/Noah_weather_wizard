# ssh with ec2 key pair file in ~/.ssh dir
# install git, clone repo
# https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html ->
#    install nvm, install node, use v16
# build modules with `npm install && npm run ww-build && npm link` in order below

# models
# app_config
# api
# utilities -> s3 tests fail
# user_facade
# forecast_service
# spot_service
# user_service

# now, I must do aws stuff

# first, it said region was missing, defining AWS_REGION env var helped with that
# `export AWS_REGION='us-east-1'`
# AMENDED to say its best to configure and point to us-east-1 as region

# then, it said:
# `    AccessDenied: User: arn:aws:sts::261071831482:assumed-role/CdkAppStack-webserverroleDB0308B6-0I5YHaVPGY8M/i-0c95159834468e476 is not authorized to perform: s3:PutObject on resource: "arn:aws:s3:::ww-s3-adapter-test/TPI_420_69/geometry.json" because no identity-based policy allows the s3:PutObject action`
# so i will adjust the role definition in CDK
#
# solved by changing ec2 user perms to s3fullaccess

# now... time to get interesting,
# db tests are failing
#
# this is multi step
# 0. pull secret from secret manager
# aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:us-east-1:261071831482:secret:PictureDatabaseSecretEC4117-3I44o6dfTbXR-WcTdv7
# 1. use secret to connect to db (from ec2) and create tables on cloud db
# 2. adjust tests st they call cloud db
# 3. get tests to use secret manager


# sudo install git
# git clone https://github.com/tjbindseil/Noah_weather_wizard.git


# node stuff
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash # TODO verify
nvm install 16

declare -a to_build=("models" "app_config" "api" "utilities" "user_facade" "forecast_service" "spot_service" "user_service")
for dir in "${to_build[@]}"
do
  cd $dir
  npm install && npm run ww-build
  npm link
  cd ../
done


# postgresql
sudo yum install postgresql15
set WW_ENV='prod' && node -e 'require("./build/src/index.js").initializeTables()'
export WW_ENV='unit_test' && node -e 'require("./build/src/index.js").initializeTables()'
export WW_ENV='docker_unit_test' && node -e 'require("./build/src/index.js").initializeTables()'

# set up reverse proxy
sudo dnf install nginx


# actually, utilities module should do this as a package.json script
# psql -U postgres -h cdkappstack-dbinstance310a317f-rxjhpgv1cvhn.cqwvcmqmveqv.us-east-1.rds.amazonaws.com -d 

# ********************************* note to self *********************************:
# still working through the above
# node -e 'require("./build/src/index.js").initializeTables("arn:aws:secretsmanager:us-east-1:261071831482:secret:PictureDatabaseSecretEC4117-3I44o6dfTbXR-WcTdv7")'
# is mad that env var is not set
# which reminds me that i need to do some thign in app config to make it work
# then
#   db will work
# then its time to do integ tests, which will probably work (after giving permissions for ec2 to call cognito)
#   I think I'm skupping this because I am fairly confident these will work if I get all the pointers right
# then set up routing (using app_config and updating cdk as we go)
#   gonna do this with nginx
#     calling <public ip>:443/spots -> localhost:8080/spot
#     calling <public ip>:443/favorites -> localhost:8080/favorite
#     calling <public ip>:443/forecasts -> localhost:8081/forecasts
#     calling <public ip>:443/users -> localhost:8082/user
#   step 1 - install nginx, record command command to do so here - done
#   step 2 - modify nginx.conf file such that it redirects to the correct service
#            this will be a pain to redo, but might as well do it quickly once
#            gonna run all these services and record their pids here: 78656 - 78849 - 78911
# file additions:
#        location /spot {
#           proxy_buffering off;
#           proxy_pass http://localhost:8080;
#       }
#       location /spots {
#           proxy_buffering off;
#           proxy_pass http://localhost:8080;
#       }
#       location /favorite {
#           proxy_buffering off;
#           proxy_pass http://localhost:8080;
#       }
#       location /favorites {
#           proxy_buffering off;
#           proxy_pass http://localhost:8080;
#       }
#
#       location /forecast {
#           proxy_buffering off;
#           proxy_pass http://localhost:8081;
#       }
#       location /forecasts {
#           proxy_buffering off;
#           proxy_pass http://localhost:8081;
#       }
#
#       location /user {
#           proxy_buffering off;
#           proxy_pass http://localhost:8082;
#       }
#       location /auth {
#           proxy_buffering off;
#           proxy_pass http://localhost:8082;
#       }
#       location /confirmation {
#           proxy_buffering off;
#           proxy_pass http://localhost:8082;
#       }
#       location /refresh {
#           proxy_buffering off;
#           proxy_pass http://localhost:8082;
#       }
#       location /new-confirmation-code {
#           proxy_buffering off;
#           proxy_pass http://localhost:8082;
#       }
#
#  * now, set up app user:
# 1. Create the user
# sudo adduser appuser --gecos "App User"

# 2. Disable login by setting the shell to /sbin/nologin
# sudo usermod -s /sbin/nologin appuser

# 3. (Optional) Lock the user’s password
# sudo passwd -l appuser

# now, how to run auotmatically/in background with pm2
# https://pm2.keymetrics.io/docs/usage/quick-start/
# * i can probably use 'Ecosystem File' to run the three services and weather updater
# * how to run as specific user? - `sudo -u appuser pm2 start app.js` (from AI)
#
# now, I will pull and build code with appuser
# naw, i will use the already pulled and built code and change ownership with:
# sudo chown -R appuser:appuser /path/to/your/app
# sudo chmod -R 750 /path/to/your/app

# lets go quick,
# push off specific user stuff
# just do pm2 stuff
# `npm install pm2@latest -g`


#
#
# getting frontend on laptop t owork tih it
