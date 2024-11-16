import { get_app_config } from 'ww-3-app-config-tjb';
import { S3Client } from '@aws-sdk/client-s3';
import { ForecastKey, S3Adapter } from 'ww-3-utilities-tjb';
import { make_fetch_forcast } from '../../src/forecast_fetcher';
import { Forecast } from '../../../models/build';
import * as fs from 'fs';
import path from 'path';

describe('forecast_fetcher tests', () => {
    const SEED_DIRECTORY =
        '/Users/tj/Projects/weather_wizard/forecast_fetcher/test/unit/resources/';
    const seedForecasts = new Map<ForecastKey, Forecast>();

    const bucketName = get_app_config().forecastBucketName;
    const s3Client = new S3Client({
        region: 'us-east-1',
    });
    const s3Adapter = new S3Adapter(s3Client, bucketName);

    //     it('not quite a test, but some code that pulls da da da', async () => {
    //         const forecastKeys = await s3Adapter.getAllPolygons();
    //
    //         const saveForecast = async (forecastKey: ForecastKey) => {
    //             const keyStr = forecastKey.getKeyStr();
    //             const forecast = await s3Adapter.getForecastJson(forecastKey);
    //
    //             const pathToWrite = path.join(
    //                 '/Users/tj/Projects/weather_wizard/forecast_fetcher/test/unit/resources/',
    //                 keyStr
    //             );
    //             console.log(`writing forecast: ${JSON.stringify(forecast)}`);
    //             console.log(`to path: ${pathToWrite}`);
    //             try {
    //                 fs.writeFileSync(pathToWrite, JSON.stringify(forecast), {
    //                     flag: 'w',
    //                 });
    //             } catch (e: unknown) {
    //                 console.error(`issue writing: ${pathToWrite}`);
    //                 console.error(e);
    //             }
    //         };
    //
    //         const promises: Promise<void>[] = [];
    //         forecastKeys.forEach((fk) => {
    //             console.log(`saving forecastkey: ${fk}`);
    //             promises.push(saveForecast(fk));
    //         });
    //
    //         await Promise.all(promises);
    //     });

    const forecastFetchFunc = make_fetch_forcast(s3Adapter);

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
            promises.push(s3Adapter.putForecastJson(forecastKey, forecast));
        });

        await Promise.all(promises);
    });

    const getLastUpdatedMap = async (forecastKeys: ForecastKey[]) => {
        const lastUpdateMap = new Map<ForecastKey, number>();
        const promises = forecastKeys.map((fk) =>
            s3Adapter
                .getForecastJson(fk)
                .then((forecast) =>
                    lastUpdateMap.set(fk, Date.parse(forecast.generatedAt))
                )
        );
        await Promise.all(promises);
        return lastUpdateMap;
    };

    it('updates all forecasts', async () => {
        const forecastKeys = Array.from(seedForecasts.keys());
        const initialLastUpdateMap = await getLastUpdatedMap(forecastKeys);

        forecastFetchFunc();

        const finalLastUpdateMap = await getLastUpdatedMap(forecastKeys);

        forecastKeys.forEach((fk) => {
            const initialLastUpdateTime = initialLastUpdateMap.get(fk);
            const finalLastUpdateTime = finalLastUpdateMap.get(fk);

            if (initialLastUpdateTime && finalLastUpdateTime) {
                console.log(
                    `initialLastUpdateTime is: ${initialLastUpdateTime} and finalLastUpdateTime is ${finalLastUpdateTime}`
                );
                expect(initialLastUpdateTime).toBeLessThan(finalLastUpdateTime);
            } else {
                throw Error(
                    `fk: ${fk.getKeyStr} is missing initial or final last update time. initial is: ${initialLastUpdateTime} and final is: ${finalLastUpdateTime}`
                );
            }
        });
    });

    // it adds a metric when a bucket isn't updated

    //          afterAll(async () => {
    //              // this thing just uses the s3 buckets, so no need to seed a bunch of db rows, just bucket data
    //
    //          const listParams = {
    //              Bucket: bucketName,
    //              Prefix: dir
    //          ;
    //
    //          const listedObjects = await s3.listObjectsV2(listParams).promise();
    //
    //          if (listedObjects.Contents.length === 0) return;
    //
    //          const deleteParams = {
    //              Bucket: bucket,
    //              Delete: { Objects: [] }
    //          };
    //
    //          listedObjects.Contents.forEach(({ Key }) => {
    //              deleteParams.Delete.Objects.push({ Key });
    //          });
    //
    //          await s3.deleteObjects(deleteParams).promise();
    //
    //          if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
    //
    //              const promises: Promise<void>[] = [];
    //              seedForecasts.forEach((forecastKey, forecast) => {
    //                  promises.push(s3Client.send(new DeleteObje);
    //              });
    //
    //              await Promise.all(promises);
    //          });
});

// async function emptyS3Directory(bucket, dir) {}

// TODO here:
// * why are we getting two buckets per env from cdk? - done
// * sites enabled nginx
// * PM2 on ec2 init
// * pull down some data from laptop bucket (do i need to refresh all those spot ids since i deleted buckets?)
// * delete stuff in the docker bucket at end of test
// * write tests - can we expose the issue from noaa and use it as a way to fix the issue and know its fixed?
