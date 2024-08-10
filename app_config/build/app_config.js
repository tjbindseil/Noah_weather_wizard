"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_app_config = void 0;
var Environment;
(function (Environment) {
    Environment[Environment["host"] = 0] = "host";
    Environment[Environment["laptopIT"] = 1] = "laptopIT";
    Environment[Environment["dev"] = 2] = "dev";
    Environment[Environment["test"] = 3] = "test";
    Environment[Environment["prod"] = 4] = "prod";
})(Environment || (Environment = {}));
var hostAppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
};
var laptopITConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
};
var devAppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
};
var testAppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
};
// TODO a lot these fields are a function of the enum, ie
// * bucketName: "dwf-3-pictures-prod",
// * pictureDbConnectionConfig.database: "prod_picture_database",
var prodAppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
};
var app_config;
var set_app_config = function () {
    var env_var = process.env.DWF_ENV;
    if (env_var === Environment[Environment.host]) {
        app_config = hostAppConfig;
    }
    else if (env_var === Environment[Environment.laptopIT]) {
        app_config = laptopITConfig;
    }
    else if (env_var === Environment[Environment.dev]) {
        app_config = devAppConfig;
    }
    else if (env_var === Environment[Environment.test]) {
        app_config = testAppConfig;
    }
    else if (env_var === Environment[Environment.prod]) {
        app_config = prodAppConfig;
    }
    else {
        throw Error("issue getting app config, env_var is: ".concat(env_var));
    }
};
var get_app_config = function () {
    if (!app_config) {
        set_app_config();
    }
    return app_config;
};
exports.get_app_config = get_app_config;
