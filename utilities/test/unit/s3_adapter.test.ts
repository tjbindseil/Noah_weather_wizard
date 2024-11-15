import forecast from '../resources/forecast.json';
import {
    DeleteObjectsCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { ForecastKey, S3Adapter } from '../../src';

describe('s3_adapter tests', () => {
    const bucketName = 'ww-s3-adapter-test';
    const testPolygonId = 'TPI';
    const testGridX = 420;
    const testGridY = 69;
    const testForecastKey = new ForecastKey(
        testPolygonId,
        testGridX,
        testGridY
    );
    const forecastKey = `${testForecastKey.getKeyStr()}/forecast.json`;
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

    beforeEach(async () => {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: forecastKey,
                Body: JSON.stringify(forecast),
                ContentType: 'application/json; charset=utf-8',
            })
        );
    });

    it('gets forecast', async () => {
        const _forecastReceived = await s3Adapter.getForecastJson(
            testForecastKey
        );
        // console.log(`forecast received is: ${forecastReceived}`);
    });

    it('throws when forecast json isnt valid', async () => {
        console.log('todo');
    });

    it('puts forecast', async () => {
        console.log('todo');
    });

    beforeEach(async () => {
        // put existing objects in
    });

    afterEach(async () => {
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
