enum Environment {
    'host', // TODO rename to laptop
    'laptopIT',
    'dev', // TODO rename to docker
    'test',
    'prod',
}

export interface AppConfig {
    locationServiceHost: string;
    locationServicePort: number;
}

const hostAppConfig: AppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
};

const laptopITConfig: AppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
};

const devAppConfig: AppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
};

const testAppConfig: AppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
};

// TODO a lot these fields are a function of the enum, ie
// * bucketName: "dwf-3-pictures-prod",
// * pictureDbConnectionConfig.database: "prod_picture_database",
const prodAppConfig: AppConfig = {
    locationServiceHost: 'localhost',
    locationServicePort: 8080,
};

let app_config: AppConfig;
const set_app_config = () => {
    const env_var = process.env.DWF_ENV;

    if (env_var === Environment[Environment.host]) {
        app_config = hostAppConfig;
    } else if (env_var === Environment[Environment.laptopIT]) {
        app_config = laptopITConfig;
    } else if (env_var === Environment[Environment.dev]) {
        app_config = devAppConfig;
    } else if (env_var === Environment[Environment.test]) {
        app_config = testAppConfig;
    } else if (env_var === Environment[Environment.prod]) {
        app_config = prodAppConfig;
    } else {
        throw Error(`issue getting app config, env_var is: ${env_var}`);
    }
};

export const get_app_config = () => {
    if (!app_config) {
        set_app_config();
    }

    return app_config;
};
