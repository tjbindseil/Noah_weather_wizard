import { SSL, SSLMode } from 'ts-postgres';

enum Environment {
    'docker_unit_test',
    'laptop',
    'staging',
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

const laptopAppConfig: AppConfig = {
    forecastBucketName: 'ww-laptop-forecast',
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

const dockerUnitTestAppConfig: AppConfig = {
    forecastBucketName: 'ww-dockerunitTest-forecast',
    spotServiceHost: 'localhost',
    spotServicePort: 8080,
    spotDbConnectionConfig: {
        database: 'ww-docker-unit-test',
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'mysecretpassword',
        ssl: SSLMode.Disable,
    },
    forecastServiceHost: 'localhost',
    forecastServicePort: 8081,
    userServiceHost: 'localhost',
    userServicePort: 8082,
};

export const prodHost = '98.80.69.4'; // heads up, services still come up serving to local host
export const prodFrontendPort = 443;
export const stagingHost = prodHost;
export const stagingFrontendPort = 4443;
export const laptopHost = 'localhost';
export const laptopFrontendPort = 3000;

const stagingAppConfig: AppConfig = {
    forecastBucketName: 'ww-staging-forecast',
    spotServiceHost: prodHost,
    spotServicePort: 8880,
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
    forecastServicePort: 8881,
    userServiceHost: prodHost,
    userServicePort: 8882,
};

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
    const env_var = process.env.WW_ENV; // TODO should probably use NODE_ENV

    if (env_var === Environment[Environment.laptop]) {
        app_config = laptopAppConfig;
    } else if (env_var === Environment[Environment.staging]) {
        app_config = stagingAppConfig;
    } else if (env_var === Environment[Environment.docker_unit_test]) {
        app_config = dockerUnitTestAppConfig;
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
