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
    forecastBucketName: string;
    spotServiceHost: string;
    spotServicePort: number;
    spotDbConnectionConfig: {
        // in the case of a secret, the database,host,port,user,password will be coming from the secret
        secret?: string;
        database: string;
        host: string;
        port: number;
        user: string;
        password: string;
        ssl: SSLMode.Disable | SSL | undefined;
    };
    forecastServiceHost: string;
    forecastServicePort: number;
    userServiceHost: string;
    userServicePort: number;
}

const hostAppConfig: AppConfig = {
    forecastBucketName: 'ww-host-forecast',
    spotServiceHost: 'localhost',
    spotServicePort: 8080,
    spotDbConnectionConfig: {
        database: 'ww',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServicePort: 8081,
    userServiceHost: 'localhost',
    userServicePort: 8082,
};

const laptopITConfig: AppConfig = {
    forecastBucketName: 'ww-laptopIT-forecast',
    spotServiceHost: 'localhost',
    spotServicePort: 8080,
    spotDbConnectionConfig: {
        database: 'ww-laptop',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServicePort: 8081,
    userServiceHost: 'localhost',
    userServicePort: 8082,
};

const devAppConfig: AppConfig = {
    forecastBucketName: 'ww-dev-forecast',
    spotServiceHost: 'localhost',
    spotServicePort: 8080,
    spotDbConnectionConfig: {
        database: 'ww-dev',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServicePort: 8081,
    userServiceHost: 'localhost',
    userServicePort: 8082,
};

const testAppConfig: AppConfig = {
    forecastBucketName: 'ww-test-forecast',
    spotServiceHost: 'localhost',
    spotServicePort: 8080,
    spotDbConnectionConfig: {
        database: 'ww-test',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServicePort: 8081,
    userServiceHost: 'localhost',
    userServicePort: 8082,
};

const unitTestAppConfig: AppConfig = {
    forecastBucketName: 'ww-unitTest-forecast',
    spotServiceHost: 'localhost',
    spotServicePort: 8080,
    spotDbConnectionConfig: {
        database: 'ww-unit-test',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServicePort: 8081,
    userServiceHost: 'localhost',
    userServicePort: 8082,
};

const prodHost = '98.80.69.4';
const prodAppConfig: AppConfig = {
    forecastBucketName: 'ww-prod-forecast',
    spotServiceHost: prodHost,
    spotServicePort: 8080,
    spotDbConnectionConfig: {
        secret: 'arn:aws:secretsmanager:us-east-1:261071831482:secret:PictureDatabaseSecretEC4117-3I44o6dfTbXR-WcTdv7',
        database: '',
        host: '',
        port: 0,
        user: '',
        password: '',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: prodHost,
    forecastServicePort: 8081,
    userServiceHost: prodHost,
    userServicePort: 8082,
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
