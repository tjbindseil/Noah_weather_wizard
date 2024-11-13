export enum Environment {
    'docker-unit-test',
    'laptop',
    'staging',
    'prod',
}

export interface AppConfig {
    forecastBucketName: string;
    spotDbConnectionConfig: {
        // in the case of a secret, the database,host,port,user,password will be coming from the secret
        secret?: string;
        database: string;
        host: string;
        port: number;
        user: string;
        password: string;
    };
    spotServiceListenPort: number;
    forecastServiceListenPort: number;
    userServiceListenPort: number;
    frontendHost: string;
    frontendServicePort: number;
}

const laptopAppConfig: AppConfig = {
    forecastBucketName: 'ww-laptop-forecast',
    spotServiceListenPort: 8080,
    spotDbConnectionConfig: {
        database: 'ww',
        host: 'localhost',
        port: 5469,
        user: '',
        password: '',
    },
    forecastServiceListenPort: 8081,
    userServiceListenPort: 8082,
    frontendHost: '127.0.0.1',
    frontendServicePort: 8888,
};

const dockerUnitTestAppConfig: AppConfig = {
    forecastBucketName: 'ww-docker-unit-test-forecast',
    spotDbConnectionConfig: {
        database: 'ww-docker-unit-test',
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'mysecretpassword',
    },
    spotServiceListenPort: 8080,
    forecastServiceListenPort: 8081,
    userServiceListenPort: 8082,
    frontendHost: '98.80.69.4',
    frontendServicePort: 8888,
};

const stagingAppConfig: AppConfig = {
    forecastBucketName: 'ww-staging-forecast',
    spotDbConnectionConfig: {
        secret: 'arn:aws:secretsmanager:us-east-1:261071831482:secret:PictureDatabaseSecretEC4117-3I44o6dfTbXR-WcTdv7',
        database: '',
        host: '',
        port: 0,
        user: '',
        password: '',
    },
    spotServiceListenPort: 8880,
    forecastServiceListenPort: 8881,
    userServiceListenPort: 8882,
    frontendHost: '98.80.69.4',
    frontendServicePort: 8888,
};

const prodAppConfig: AppConfig = {
    forecastBucketName: 'ww-prod-forecast',
    spotDbConnectionConfig: {
        secret: 'arn:aws:secretsmanager:us-east-1:261071831482:secret:PictureDatabaseSecretEC4117-3I44o6dfTbXR-WcTdv7',
        database: '',
        host: '',
        port: 0,
        user: '',
        password: '',
    },
    spotServiceListenPort: 8080,
    forecastServiceListenPort: 8081,
    userServiceListenPort: 8082,
    frontendHost: '98.80.69.4',
    frontendServicePort: 80,
};

let appConfigSet = false;
let app_config: AppConfig;
const set_app_config = () => {
    const env_var = process.env.WW_ENV; // TODO should probably use NODE_ENV

    if (env_var === Environment[Environment.laptop]) {
        app_config = laptopAppConfig;
    } else if (env_var === Environment[Environment.staging]) {
        app_config = stagingAppConfig;
    } else if (env_var === Environment[Environment['docker-unit-test']]) {
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
