import {
    DeleteObjectsCommand,
    ListObjectsV2Command,
    S3Client,
} from '@aws-sdk/client-s3';
import { getForecast, getForecastKey, S3Adapter } from '../../src';
import { getForecastHourly } from '../../src/noaa_api';

describe('s3_adapter and noaa_api tests', () => {
    const bucketName = 'ww-s3-adapter-test';

    const longsPeak = {
        lat: 40.255014,
        lng: -105.615115,
    };

    const s3Client = new S3Client();
    const s3Adapter = new S3Adapter(s3Client, bucketName);

    beforeAll(async () => {
        const response = await s3Client.send(
            new ListObjectsV2Command({
                Bucket: bucketName,
            })
        );

        if (response.KeyCount && response.KeyCount > 0) {
            throw new Error(
                `bucket should be empty but has ${response.KeyCount} keys`
            );
        }
    });

    it('gets and stores forecast and hourly forecast', async () => {
        const fk = await getForecastKey(longsPeak.lat, longsPeak.lng);
        const forecast = await getForecast(fk);
        const forecastHourly = await getForecastHourly(fk);

        await s3Adapter.putForecast(fk, forecast);
        await s3Adapter.putForecastHourly(fk, forecastHourly);

        const _forecast = await s3Adapter.getForecast(fk);
        const _forecastHourly = await s3Adapter.getForecastHourly(fk);
    });

    afterAll(async () => {
        const listResponse = await s3Client.send(
            new ListObjectsV2Command({
                Bucket: bucketName,
            })
        );

        await s3Client.send(
            new DeleteObjectsCommand({
                Bucket: bucketName,
                Delete: {
                    Objects: listResponse.Contents?.map((content) => ({
                        Key: content.Key,
                    })),
                },
            })
        );
    });
});
