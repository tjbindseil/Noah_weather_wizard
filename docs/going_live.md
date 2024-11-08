# Going live!
* backend
  * one env, prod
    * for dev, lets just keep using my laptop since its free and i have no income currently
  * each env:
    * one RDS
      * now this can be only exposed to the machine the containers are on
    * one machine
    * three containers (spot, forecast, user)
    * how to expose the machine/containers?
      * options:
      1) just do it - expose the ports on the machine / hosts for user/spot/forecast service to the public 
        * I *think* this is what cors is for, basically, only requests coming from `weatherwizard.com` will be allowed in
        * this seems about as safe as could be
  * first, manually
  * then, cdk
  * use integ tests to test the cloud stack
* CI/CD
  * deploy on git push of certain branch? maybe a script (that could be hooked to git push or run manually, manually for now)

## Tracking in order to ultimately CDK this thing
* making one RDS
* honestly, would this be easier to just use CDK?

### DB subnet group
* needs:
  * private subnet for RDS
  * public subnet with firewall for dockers
  * connection between public and private subnets so that dockers can read and write to the RDS

## RDS
* aurora vs rds?
  * rds is 750 hours per month free tier, easy choice there
* first, deleting old one, and making new one
* hmmm, to kms or not to kms?
  * kms
    * easy
    * costs (10 cents per month or so)
  * no kms
    * how???
    * well, the user/pw could be stored as env vars
      * this way, they are outside the code
      * but, they are not encrypted
      * in the worst case, if a malicious user hacks the db it wouldn't be that bad, there is no user info, just forecasts, spots, and favorites
      * a malicious user could add bad data or remove data
      * this is mitigated by occasionally taking a snapshot

## curve ball
why not lambdas?

pros:
* 1 mil free requests per month
* my weather app is very much a crud app
* I've done it before and know how to do it

cons:
* have to rewrite a bit
  * all my code is centered around full running services
  * all my integ tests are this way too
  * it seems possible via [aws sam](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html)

### another idea
just run the services on the ec2 instance

This will be pretty fast and pretty easy and would match whats going on on my laptop pretty well

what happens when it crashes? - idk, maybe a script or something
i think the same could be asked about ECS/Docker/Fargate
not sure what happens if lambda fails
