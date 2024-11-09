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

# then, it said:
# `    AccessDenied: User: arn:aws:sts::261071831482:assumed-role/CdkAppStack-webserverroleDB0308B6-0I5YHaVPGY8M/i-0c95159834468e476 is not authorized to perform: s3:PutObject on resource: "arn:aws:s3:::ww-s3-adapter-test/TPI_420_69/geometry.json" because no identity-based policy allows the s3:PutObject action`
# so i will adjust the role definition in CDK
#
# solved by changing ec2 user perms to s3fullaccess
