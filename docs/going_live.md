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

### DB subnet group
* TODO continue here because I don't know what the subnet is gonna be

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
