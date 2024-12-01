import { S3Client } from '@aws-sdk/client-s3';
import { get_app_config } from 'ww-3-app-config-tjb';
import { S3Adapter } from 'ww-3-utilities-tjb';
import { ForecastFetcher } from './forecast_fetcher';

// TODO delete is actually a bit more complicated,
// if there is no more spots looking at it, we should delete the s3 folder and its contents
// -- OR --
// we could do that in the background as part of the updating of the cache
//
// ...
//
// while im at it, it could be helpful to delete duplicate rows in the spot table?

const bucketName = get_app_config().forecastBucketName;
const s3Client = new S3Client({
    region: 'us-east-1',
});
const s3Adapter = new S3Adapter(s3Client, bucketName);

const oneHourInMilliseconds = 1000 * 60 * 60;
const fourHoursInMilliseconds = 1000 * 60 * 60 * 4;
const forecastFetcher = new ForecastFetcher();
setInterval(
    () => forecastFetcher.fetchForecast(s3Adapter),
    fourHoursInMilliseconds
);
setInterval(
    () => forecastFetcher.fetchForecastHourly(s3Adapter),
    oneHourInMilliseconds
);
