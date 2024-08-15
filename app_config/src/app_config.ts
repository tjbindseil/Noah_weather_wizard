import { SSL, SSLMode } from 'ts-postgres';

enum Environment {
    'host', // TODO rename to laptop
    'laptopIT',
    'dev', // TODO rename to docker
    'test',
    'unit_test',
    'prod',
}

export interface AppConfig {
    locationServiceHost: string;
    locationServicePort: number;
    locationDbConnectionConfig: {
        database: string;
        host: string;
        port: number;
        user: string;
        password: string;
        ssl: SSLMode.Disable | SSL | undefined;
    };
    forecastServiceHost: string;
    forecastServiceNumber: number;
}

const hostAppConfig: AppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
    locationDbConnectionConfig: {
        database: 'ww',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServiceNumber: 8081,
};

const laptopITConfig: AppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
    locationDbConnectionConfig: {
        database: 'ww-laptop',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServiceNumber: 8081,
};

const devAppConfig: AppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
    locationDbConnectionConfig: {
        database: 'ww-dev',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServiceNumber: 8081,
};

const testAppConfig: AppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
    locationDbConnectionConfig: {
        database: 'ww-test',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServiceNumber: 8081,
};

const unitTestAppConfig: AppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
    locationDbConnectionConfig: {
        database: 'ww-unit-test',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServiceNumber: 8081,
};

const prodAppConfig: AppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
    locationDbConnectionConfig: {
        database: 'ww-prod',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServiceNumber: 8081,
};

let appConfigSet = false;
let app_config: AppConfig;
const set_app_config = () => {
    const env_var = process.env.WW_ENV;

    if (env_var === Environment[Environment.host]) {
        app_config = hostAppConfig;
    } else if (env_var === Environment[Environment.laptopIT]) {
        app_config = laptopITConfig;
    } else if (env_var === Environment[Environment.dev]) {
        app_config = devAppConfig;
    } else if (env_var === Environment[Environment.test]) {
        app_config = testAppConfig;
    } else if (env_var === Environment[Environment.unit_test]) {
        app_config = unitTestAppConfig;
    } else if (env_var === Environment[Environment.prod]) {
        app_config = prodAppConfig;
    } else {
        throw Error(`issue getting app config, env_var is: ${env_var}`);
    }

    appConfigSet = true;
};

export const get_app_config = () => {
    if (!appConfigSet) {
        set_app_config();
    }

    return app_config;
};
