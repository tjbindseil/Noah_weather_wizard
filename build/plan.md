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
  * integ test script can check if the services are running on machine (check the port)
    * if not present, start and stop as part of the script

  &&&& DO I WANNA USE DOCKER?? &&&&
  first lets not

ok, so what about when i make a change?

idk about all this thinking, whats next?

this database test issue is tough, maybe only test it in dev?

or maybe, I just run a small postrges db
