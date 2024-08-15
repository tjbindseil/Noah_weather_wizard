"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_app_config = void 0;
var ts_postgres_1 = require("ts-postgres");
var Environment;
(function (Environment) {
    Environment[Environment["host"] = 0] = "host";
    Environment[Environment["laptopIT"] = 1] = "laptopIT";
    Environment[Environment["dev"] = 2] = "dev";
    Environment[Environment["test"] = 3] = "test";
    Environment[Environment["unit_test"] = 4] = "unit_test";
    Environment[Environment["prod"] = 5] = "prod";
})(Environment || (Environment = {}));
var hostAppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
    locationDbConnectionConfig: {
        database: 'ww',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: ts_postgres_1.SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServiceNumber: 8081,
};
var laptopITConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
    locationDbConnectionConfig: {
        database: 'ww-laptop',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: ts_postgres_1.SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServiceNumber: 8081,
};
var devAppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
    locationDbConnectionConfig: {
        database: 'ww-dev',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: ts_postgres_1.SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServiceNumber: 8081,
};
var testAppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
    locationDbConnectionConfig: {
        database: 'ww-test',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: ts_postgres_1.SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServiceNumber: 8081,
};
var unitTestAppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
    locationDbConnectionConfig: {
        database: 'ww-unit-test',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: ts_postgres_1.SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServiceNumber: 8081,
};
var prodAppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
    locationDbConnectionConfig: {
        database: 'ww-prod',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: ts_postgres_1.SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServiceNumber: 8081,
};
var appConfigSet = false;
var app_config;
var set_app_config = function () {
    var env_var = process.env.WW_ENV;
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
    else if (env_var === Environment[Environment.unit_test]) {
        app_config = unitTestAppConfig;
    }
    else if (env_var === Environment[Environment.prod]) {
        app_config = prodAppConfig;
    }
    else {
        throw Error("issue getting app config, env_var is: ".concat(env_var));
    }
    appConfigSet = true;
};
var get_app_config = function () {
    if (!appConfigSet) {
        set_app_config();
    }
    return app_config;
};
exports.get_app_config = get_app_config;
