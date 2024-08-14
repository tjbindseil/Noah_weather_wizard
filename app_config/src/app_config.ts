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
};

// TODO a lot these fields are a function of the enum, ie
// * bucketName: "dwf-3-pictures-prod",
// * pictureDbConnectionConfig.database: "prod_picture_database",
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
};

let appConfigSet = false;
let app_config: AppConfig;
const set_app_config = () => {
    console.log('TJTAG SETTING app_config');
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
        console.log('TJTAG setting app_config to unit test app config');
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
