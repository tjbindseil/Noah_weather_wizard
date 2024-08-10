This has the models used for draw with friends.

Currently, this is in development and is linked to the dependent package, run tsc here, then run npm link ../models && tsc in the dependent package

This package generates schemas via typescript-json-schema. To do this, run npm run schema. It turns interfaces into json to be used at runtime.
see here: https://dev.to/urosstok/input-validation-in-express-from-typescript-1p05

## TODO
* rearrange old models so it they are in folders according to their owning service. ie `user_service_models`, `picture_service_models`, etc
