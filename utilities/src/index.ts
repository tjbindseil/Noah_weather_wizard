export { S3Adapter } from './s3_adapter';
export { makeInitialCall, getForecast } from './noaa_api';
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

export const getSecretValue = async (secretName: string) => {
    const client = new SecretsManagerClient();
    const response = await client.send(
        new GetSecretValueCommand({
            SecretId: secretName,
        })
    );
    console.log(response);

    if (response.SecretString) {
        return response.SecretString;
    }

    if (response.SecretBinary) {
        return response.SecretBinary;
    }
};

const ONLY_CURRENT_SECRET =
    'arn:aws:secretsmanager:us-east-1:261071831482:secret:PictureDatabaseSecretEC4117-3I44o6dfTbXR-WcTdv7';
export const initializeTables = async (secretName = ONLY_CURRENT_SECRET) => {
    const secretValue = JSON.parse(
        (await getSecretValue(secretName)) as string
    );

    const dbConnectionConfig = get_app_config().spotDbConnectionConfig;
    const authorizedDBConnectionConfig = {
        ...dbConnectionConfig,
        database: secretValue.dbname,
        host: secretValue.host,
        port: secretValue.port,
        user: secretValue.username,
        password: secretValue.password,
    };

    const pool = createPool(
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

    const pgClient = await pool.acquire();

    await makeTables(pgClient);
};

// getSecretValue(
//     'arn:aws:secretsmanager:us-east-1:261071831482:secret:PictureDatabaseSecretEC4117-3I44o6dfTbXR-WcTdv7'
// );
