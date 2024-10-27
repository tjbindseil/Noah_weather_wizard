# User Service
A very thin service that just houses calls to the `user_facade`. This is necessary in order for
a smoother integration with the AWS configuration process. On a laptop or docker or lambda, these
credentials can be referenced from a particular place on the machine. In a browser, things would
be more complicated.
