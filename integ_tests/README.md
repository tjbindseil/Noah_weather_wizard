## Backend Tests
So far, what does the backend do?

* post spot
* delete spot
* get spots

This shouldn't be too hard:
1. post some spots
2. get them
3. delete them

but, it would be good to test the whole forecast fetching aspect as well. Which will
require me to actually write that code.

### Idea
The cyclical updating of forecasts will need to be tested. To do this,
we could run the service with the timer configured based on env.

This means this test will only be able to run when we are kicking
off the services with the script (not running against live services).

Might need two different jest configs to accomplish this omission.
