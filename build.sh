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


sudo install git
git clone https://github.com/tjbindseil/Noah_weather_wizard.git


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
node -e 'require("./build/src/index.js").getSecretValue("arn:aws:secretsmanager:us-east-1:261071831482:secret:PictureDatabaseSecretEC4117-3I44o6dfTbXR-WcTdv7")'

# actually, utilities module should do this as a package.json script
# psql -U postgres -h cdkappstack-dbinstance310a317f-rxjhpgv1cvhn.cqwvcmqmveqv.us-east-1.rds.amazonaws.com -d 

********************************* note to self *********************************:
still working through the above
node -e 'require("./build/src/index.js").initializeTables("arn:aws:secretsmanager:us-east-1:261071831482:secret:PictureDatabaseSecretEC4117-3I44o6dfTbXR-WcTdv7")'
is mad that env var is not set
which reminds me that i need to do some thign in app config to make it work
then
  db will work <-- here
then its time to do integ tests, which will probably work (after giving permissions for ec2 to call cognito)
then set up routing (using app_config and updating cdk as we go)
getting frontend on laptop t owork tih it
