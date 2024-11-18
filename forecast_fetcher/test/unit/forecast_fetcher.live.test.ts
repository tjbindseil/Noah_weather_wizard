import { get_app_config } from 'ww-3-app-config-tjb';
import { S3Client } from '@aws-sdk/client-s3';
import { ForecastKey, S3Adapter } from 'ww-3-utilities-tjb';
import { Forecast } from 'ww-3-models-tjb';
import * as fs from 'fs';
import path from 'path';
import { ForecastFetcher } from '../../src/forecast_fetcher';

describe('forecast_fetcher LIVE tests', () => {
    // TODO this test is spotty because once in a while the NOAA endpoint returns an empty obj
    const SEED_DIRECTORY =
        '/Users/tj/Projects/weather_wizard/forecast_fetcher/test/unit/resources/';
    const seedForecasts = new Map<ForecastKey, Forecast>();

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

        // this thing just uses the s3 buckets, so no need to seed a bunch of db rows, just bucket data
        const promises: Promise<void>[] = [];
        seedForecasts.forEach((forecast, forecastKey) => {
            promises.push(s3Adapter.putForecast(forecastKey, forecast));
        });

        await Promise.all(promises);
    });

    const getLastForecastUpdatedTimes = async (fks: ForecastKey[]) => {
        const lastUpdatedForecastMap = new Map<ForecastKey, number>();
        const initialPromises = fks.map((fk) =>
            s3Adapter
                .getForecast(fk)
                .then((forecast) =>
                    lastUpdatedForecastMap.set(
                        fk,
                        Date.parse(forecast.generatedAt)
                    )
                )
        );
        await Promise.all(initialPromises);
        return lastUpdatedForecastMap;
    };

    it('updates all forecasts', async () => {
        const forecastKeys = Array.from(seedForecasts.keys());

        const initialLastUpdateMap = await getLastForecastUpdatedTimes(
            forecastKeys
        );

        await forecastFetcher.fetchForecast();

        const finalLastUpdateMap = await getLastForecastUpdatedTimes(
            forecastKeys
        );

        forecastKeys.forEach((fk) => {
            const initialLastUpdateTime = initialLastUpdateMap.get(fk);
            const finalLastUpdateTime = finalLastUpdateMap.get(fk);

            if (initialLastUpdateTime && finalLastUpdateTime) {
                expect(initialLastUpdateTime).toBeLessThan(finalLastUpdateTime);
            } else {
                throw Error(
                    `fk: ${fk.getKeyStr} is missing initial or final last update time. initial is: ${initialLastUpdateTime} and final is: ${finalLastUpdateTime}`
                );
            }
        });
    });
});
