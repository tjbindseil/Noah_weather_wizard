import { get_app_config } from 'ww-3-app-config-tjb';
import {
    DeleteObjectsCommand,
    ListObjectsV2Command,
    S3Client,
} from '@aws-sdk/client-s3';
import { ForecastKey, S3Adapter } from 'ww-3-utilities-tjb';
import { Forecast, ForecastHourly } from 'ww-3-models-tjb';
import * as fs from 'fs';
import path from 'path';
import { ForecastFetcher } from '../../src/forecast_fetcher';

describe('forecast_fetcher LIVE tests', () => {
    // TODO this test is spotty because once in a while the NOAA endpoint returns an empty obj
    const SEED_DIRECTORY =
        '/Users/tj/Projects/weather_wizard/forecast_fetcher/test/unit/resources/';
    const SEED_DIRECTORY_HOURLY =
        '/Users/tj/Projects/weather_wizard/forecast_fetcher/test/unit/resources_hourly/';
    const seedForecasts = new Map<ForecastKey, Forecast>();
    const seedForecastsHourly = new Map<ForecastKey, ForecastHourly>();

    const bucketName = get_app_config().forecastBucketName;
    const s3Client = new S3Client({
        region: 'us-east-1',
    });
    const s3Adapter = new S3Adapter(s3Client, bucketName);
    const forecastFetcher = new ForecastFetcher(s3Adapter);

    beforeAll(async () => {
        fs.readdirSync(SEED_DIRECTORY).forEach((fileName) => {
            const contents = fs
                .readFileSync(path.join(SEED_DIRECTORY, fileName))
                .toString();
            const forecast = JSON.parse(contents) as Forecast;
            const filenameTokens = fileName.split('_');
            const forecastKey = new ForecastKey(
                filenameTokens[0],
                Number(filenameTokens[1]),
                Number(filenameTokens[2])
            );
            seedForecasts.set(forecastKey, forecast);
        });

        fs.readdirSync(SEED_DIRECTORY_HOURLY).forEach((fileName) => {
            const contents = fs
                .readFileSync(path.join(SEED_DIRECTORY_HOURLY, fileName))
                .toString();
            const forecastHourly = JSON.parse(contents) as ForecastHourly;
            const filenameTokens = fileName.split('_');
            const forecastKey = new ForecastKey(
                filenameTokens[0],
                Number(filenameTokens[1]),
                Number(filenameTokens[2])
            );
            seedForecastsHourly.set(forecastKey, forecastHourly);
        });

        // this thing just uses the s3 buckets, so no need to seed a bunch of db rows, just bucket data
        const promises: Promise<void>[] = [];
        seedForecasts.forEach((forecast, forecastKey) => {
            promises.push(s3Adapter.putForecast(forecastKey, forecast));
        });
        seedForecastsHourly.forEach((forecastHourly, forecastKey) => {
            promises.push(
                s3Adapter.putForecastHourly(forecastKey, forecastHourly)
            );
        });

        await Promise.all(promises);
    });

    it('updates all forecasts', async () => {
        await forecastFetcher.fetchForecast();

        const forecastKeys = Array.from(seedForecasts.keys());
        const forecastPromises: Promise<Forecast>[] = [];
        forecastKeys.forEach((fk) => {
            forecastPromises.push(s3Adapter.getForecast(fk));
        });

        const forecasts = await Promise.all(forecastPromises);
        forecasts.forEach((f) => expect(f).toBeDefined());
    });

    it('updates all hourly forecasts', async () => {
        await forecastFetcher.fetchForecastHourly();

        const forecastKeys = Array.from(seedForecasts.keys());
        const forecastHourlyPromises: Promise<ForecastHourly>[] = [];
        forecastKeys.forEach((fk) => {
            forecastHourlyPromises.push(s3Adapter.getForecastHourly(fk));
        });

        const forecastHourlys = await Promise.all(forecastHourlyPromises);
        forecastHourlys.forEach((f) => expect(f).toBeDefined());
    });

    afterAll(async () => {
        let continuationToken: string | undefined;

        do {
            const listObjectsResponse = await s3Client.send(
                new ListObjectsV2Command({
                    Bucket: bucketName,
                    ContinuationToken: continuationToken,
                })
            );

            const deleteObjectsRequest = {
                Bucket: bucketName,
                Delete: {
                    Objects:
                        listObjectsResponse.Contents?.map((obj) => ({
                            Key: obj.Key!,
                        })) || [],
                },
            };

            if (deleteObjectsRequest.Delete.Objects.length > 0) {
                await s3Client.send(
                    new DeleteObjectsCommand(deleteObjectsRequest)
                );
            }

            continuationToken = listObjectsResponse.NextContinuationToken;
        } while (continuationToken);
    });
});
