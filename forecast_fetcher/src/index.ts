import { S3Client } from '@aws-sdk/client-s3';
import { get_app_config } from 'ww-3-app-config-tjb';
import { S3Adapter } from 'ww-3-utilities-tjb';
import { make_fetch_forcast } from './forecast_fetcher';

// Hmmm, this is pretty independent of the forecast_service
// this could easily be a lambda that triggers another lambda
// initial lambda just reads all the polygons, and for each polygon,
// it queues up a bunch of SQS messages, each has a forecastURL and polygonID
// then, a lambda (paralellized) consumes those messages and fetches the
// latest forecast for each
//
// until this gets moved to AWS and starts getting scaled, its not necessary
// TODO delete is actually a bit more complicated,
// if there is no more spots looking at it, we should delete the s3 folder and its contents
// -- OR --
// we could do that in the background as part of the updating of the cache
//
// ...
//
// while im at it, it could be helpful to delete duplicate rows in the spot table?

// how should it even be?
// i like the idea of a chron job
// the chron job starts this whole process off
//
// i want to try out a lambda

const bucketName = get_app_config().forecastBucketName;
const s3Client = new S3Client({
    region: 'us-east-1',
});
const s3Adapter = new S3Adapter(s3Client, bucketName);

const fourHoursInMilliseconds = 1000 * 60 * 60 * 4;
const fetchForecastFunc = make_fetch_forcast(s3Adapter);
setInterval(fetchForecastFunc, fourHoursInMilliseconds);
