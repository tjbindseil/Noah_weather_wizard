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
    frontendServiceHost: string;
    frontendServicePort: number;
    userPoolId: string;
    userPoolClientId: string;
}

const prodHost = '3.208.25.58';

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
    frontendServiceHost: '127.0.0.1',
    frontendServicePort: 8888,
    userPoolId: 'us-east-1_ZVFeJ2Kqj',
    userPoolClientId: '6j6t301u6iu773ic3dc627fi0n',
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
    frontendServiceHost: prodHost,
    frontendServicePort: 8888,
    userPoolId: 'us-east-1_ZVFeJ2Kqj',
    userPoolClientId: '6j6t301u6iu773ic3dc627fi0n',
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
    frontendServiceHost: prodHost,
    frontendServicePort: 8888,
    userPoolId: 'us-east-1_35BKiPwnQ',
    userPoolClientId: '3mq06dv4oh81u1na3vn59kgik9',
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
    frontendServiceHost: prodHost,
    frontendServicePort: 80,
    userPoolId: 'us-east-1_Yd9p9O1m7',
    userPoolClientId: '26koknide856thsp3v78fgtv6g',
};

let appConfigSet = false;
let app_config: AppConfig;
const set_app_config = (env_var?: string) => {
    const env = env_var ?? process.env.WW_ENV;

    if (env === Environment[Environment.laptop]) {
        app_config = laptopAppConfig;
    } else if (env === Environment[Environment.staging]) {
        app_config = stagingAppConfig;
    } else if (env === Environment[Environment['docker-unit-test']]) {
        app_config = dockerUnitTestAppConfig;
    } else if (env === Environment[Environment.prod]) {
        app_config = prodAppConfig;
    } else {
        throw Error(`issue getting app config, env_var is: ${env}`);
    }

    appConfigSet = true;
};

export const get_app_config = (env_var?: string) => {
    if (!appConfigSet) {
        set_app_config(env_var);
    }

    return app_config;
};
