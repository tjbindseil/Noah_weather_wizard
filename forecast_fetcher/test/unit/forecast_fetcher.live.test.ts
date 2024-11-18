import { get_app_config } from 'ww-3-app-config-tjb';
import { S3Client } from '@aws-sdk/client-s3';
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

    // uhhhh how to get hourly foreasts here
    //     it('not quite a test, but some code that pulls da da da', async () => {
    //         const forecastKeys = await s3Adapter.getAllPolygons();
    //
    //         const saveForecastHourly = async (forecastKey: ForecastKey) => {
    //             const keyStr = forecastKey.getKeyStr();
    //             console.log(
    //                 `about to get hourly forecast for fk: ${forecastKey.getKeyStr()}`
    //             );
    //             const forecastHourly = await s3Adapter.getForecastHourly(
    //                 forecastKey
    //             );
    //             console.log(
    //                 `done get hourly forecast for fk: ${forecastKey.getKeyStr()}`
    //             );
    //
    //             const pathToWrite = path.join(
    //                 '/Users/tj/Projects/weather_wizard/forecast_fetcher/test/unit/resources_hourly/',
    //                 keyStr
    //             );
    //             console.log(
    //                 `writing forecastHourly: ${JSON.stringify(forecastHourly)}`
    //             );
    //             console.log(`to path: ${pathToWrite}`);
    //             try {
    //                 fs.writeFileSync(pathToWrite, JSON.stringify(forecastHourly), {
    //                     flag: 'w',
    //                 });
    //             } catch (e: unknown) {
    //                 console.error(`issue writing: ${pathToWrite}`);
    //                 console.error(e);
    //             }
    //         };
    //
    //         const promises: Promise<void>[] = [];
    //         console.log('printing fks');
    //         forecastKeys.forEach((fk) => console.log(fk));
    //         console.log('donen printing fks');
    //         forecastKeys.forEach((fk) => {
    //             console.log(`saving forecastkey: ${fk.getKeyStr()}`);
    //             promises.push(saveForecastHourly(fk));
    //         });
    //
    //         await Promise.all(promises);
    //     });

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

    const getLastForecastHourlyUpdatedTimes = async (fks: ForecastKey[]) => {
        const lastUpdatedForecastHourlyMap = new Map<ForecastKey, number>();
        const initialPromises = fks.map((fk) =>
            s3Adapter
                .getForecastHourly(fk)
                .then((forecastHourly) =>
                    lastUpdatedForecastHourlyMap.set(
                        fk,
                        Date.parse(forecastHourly.generatedAt)
                    )
                )
        );
        await Promise.all(initialPromises);
        return lastUpdatedForecastHourlyMap;
    };

    it.skip('updates all forecasts', async () => {
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

    it('updates all hourly forecasts', async () => {
        const forecastKeys = Array.from(seedForecasts.keys());

        const initialLastUpdateMap = await getLastForecastHourlyUpdatedTimes(
            forecastKeys
        );

        await forecastFetcher.fetchForecastHourly();

        const finalLastUpdateMap = await getLastForecastHourlyUpdatedTimes(
            forecastKeys
        );

        forecastKeys.forEach((fk) => {
            const initialLastUpdateTime = initialLastUpdateMap.get(fk);
            const finalLastUpdateTime = finalLastUpdateMap.get(fk);

            if (initialLastUpdateTime && finalLastUpdateTime) {
                expect(initialLastUpdateTime).toBeLessThan(finalLastUpdateTime);
            } else {
                throw Error(
                    `(hourly) fk: ${fk.getKeyStr} is missing initial or final last update time. initial is: ${initialLastUpdateTime} and final is: ${finalLastUpdateTime}`
                );
            }
        });
    });
});
