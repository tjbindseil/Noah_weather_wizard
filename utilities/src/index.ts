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

export const getSecretValue = async (secretName = 'SECRET_NAME') => {
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

getSecretValue(
    'arn:aws:secretsmanager:us-east-1:261071831482:secret:PictureDatabaseSecretEC4117-3I44o6dfTbXR-WcTdv7'
);
