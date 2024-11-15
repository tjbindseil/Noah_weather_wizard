export { S3Adapter } from './s3_adapter';
export { getForecastKey, getForecast } from './noaa_api';
export { ForecastKey } from './forecast_key';
export {
    insertSpot,
    getAllSpots,
    getSpots,
    getSpot,
    deleteSpot,
} from './db/spot_db';
export {
    insertFavorite,
    getFavoritesByUsername,
    getFavoritesBySpot,
    deleteFavorite,
} from './db/favorite_db';

import {
    GetSecretValueCommand,
    SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { createPool } from 'generic-pool';
import { Client } from 'ts-postgres';
import { get_app_config } from 'ww-3-app-config-tjb';
import { makeTables } from './db';

const getSecretValue = async (secretName: string) => {
    const client = new SecretsManagerClient();
    const response = await client.send(
        new GetSecretValueCommand({
            SecretId: secretName,
        })
    );

    if (response.SecretString) {
        return response.SecretString;
    }

    if (response.SecretBinary) {
        return response.SecretBinary;
    }
};

export const getPgClientPool = async () => {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    let authorizedDBConnectionConfig: any;
    const dbConnectionConfig = get_app_config().spotDbConnectionConfig;
    if (dbConnectionConfig.secret) {
        const secretValue = JSON.parse(
            (await getSecretValue(dbConnectionConfig.secret)) as string
        );
        authorizedDBConnectionConfig = {
            ...dbConnectionConfig,
            database: secretValue.dbname,
            host: secretValue.host,
            port: secretValue.port,
            user: secretValue.username,
            password: secretValue.password,
        };
    } else {
        authorizedDBConnectionConfig = dbConnectionConfig;
    }

    return createPool(
        {
            create: async () => {
                const client = new Client(authorizedDBConnectionConfig);
                await client.connect();
                client.on('error', console.log);
                return client;
            },
            destroy: async (client: Client) => client.end(),
            validate: (client: Client) => {
                return Promise.resolve(!client.closed);
            },
        },
        {
            testOnBorrow: true,
            max: 1,
            min: 1,
        }
    );
};

export const initializeTables = async () => {
    const pool = await getPgClientPool();
    const pgClient = await pool.acquire();

    await makeTables(pgClient);
};
