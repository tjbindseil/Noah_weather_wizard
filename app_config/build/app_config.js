"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_app_config = void 0;
var ts_postgres_1 = require("ts-postgres");
var _Environment;
(function (_Environment) {
    _Environment[_Environment["host"] = 0] = "host";
    _Environment[_Environment["laptopIT"] = 1] = "laptopIT";
    _Environment[_Environment["dev"] = 2] = "dev";
    _Environment[_Environment["test"] = 3] = "test";
    _Environment[_Environment["unit_test"] = 4] = "unit_test";
    _Environment[_Environment["prod"] = 5] = "prod";
})(_Environment || (_Environment = {}));
var _hostAppConfig = {
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
};
var _laptopITConfig = {
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
};
var _devAppConfig = {
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
};
var _testAppConfig = {
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
};
var _unitTestAppConfig = {
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
};
// TODO a lot these fields are a function of the enum, ie
// * bucketName: "dwf-3-pictures-prod",
// * pictureDbConnectionConfig.database: "prod_picture_database",
var _prodAppConfig = {
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
};
var _appConfigSet = false;
var app_config;
var set_app_config = function () {
    console.log('TJTAG Throwing error in SETTING app_config');
    throw Error('TJTAG SETTING app_config');
    //     console.log('TJTAG SETTING app_config');
    //     const env_var = process.env.DWF_ENV;
    //
    //     if (env_var === Environment[Environment.host]) {
    //         app_config = hostAppConfig;
    //     } else if (env_var === Environment[Environment.laptopIT]) {
    //         app_config = laptopITConfig;
    //     } else if (env_var === Environment[Environment.dev]) {
    //         app_config = devAppConfig;
    //     } else if (env_var === Environment[Environment.test]) {
    //         app_config = testAppConfig;
    //     } else if (env_var === Environment[Environment.unit_test]) {
    //         console.log('TJTAG setting app_config to unit test app config');
    //         app_config = unitTestAppConfig;
    //     } else if (env_var === Environment[Environment.prod]) {
    //         app_config = prodAppConfig;
    //     } else {
    //         throw Error(`issue getting app config, env_var is: ${env_var}`);
    //     }
    //
    //     _appConfigSet = true;
};
var get_app_config = function () {
    if (!_appConfigSet) {
        set_app_config();
    }
    return app_config;
};
exports.get_app_config = get_app_config;
