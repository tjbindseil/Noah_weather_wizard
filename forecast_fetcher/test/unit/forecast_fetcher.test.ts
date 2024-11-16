import { get_app_config } from 'ww-3-app-config-tjb';
import { S3Client } from '@aws-sdk/client-s3';
import { ForecastKey, S3Adapter } from 'ww-3-utilities-tjb';
import { make_fetch_forcast } from '../../src/forecast_fetcher';
import { Forecast } from '../../../models/build';

describe('forecast_fetcher tests', () => {
    const seedForecasts = new Map<ForecastKey, Forecast>();

    const bucketName = get_app_config().forecastBucketName;
    const s3Client = new S3Client({
        region: 'us-east-1',
    });
    const s3Adapter = new S3Adapter(s3Client, bucketName);

    const forecastFetchFunc = make_fetch_forcast(s3Adapter);

    beforeAll(async () => {
        // this thing just uses the s3 buckets, so no need to seed a bunch of db rows, just bucket data
        const promises: Promise<void>[] = [];
        seedForecasts.forEach((forecastKey, forecast) => {
            promises.push(s3Adapter.putForecastJson(forecast, forecastKey));
        });

        await Promise.all(promises);
    });

    it('updates all forecasts', async () => {
        // get all forecasts and their last updated timestamp

        forecastFetchFunc();

        // get all forecasts and ensure the last updated timestamp is updated
    });

    // it adds a metric when a bucket isn't updated

    afterAll(async () => {
        // this thing just uses the s3 buckets, so no need to seed a bunch of db rows, just bucket data

    const listParams = {
        Bucket: bucketName,
        Prefix: dir
    ;

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);

        const promises: Promise<void>[] = [];
        seedForecasts.forEach((forecastKey, forecast) => {
            promises.push(s3Client.send(new DeleteObje);
        });

        await Promise.all(promises);
    });
});

async function emptyS3Directory(bucket, dir) {
}




// TODO here:
// * why are we getting two buckets per env from cdk?
// * pull down some data from laptop bucket (do i need to refresh all those spot ids since i deleted buckets?)
// * delete stuff in the docker bucket at end of test
// * write tests - can we expose the issue from noaa and use it as a way to fix the issue and know its fixed?
