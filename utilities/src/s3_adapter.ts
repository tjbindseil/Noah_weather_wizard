import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { APIError } from 'ww-3-api-tjb';

export class S3Adapter {
    private readonly GEOMETRY_FILE_NAME = 'geometry.json';
    private readonly FORECAST_FILE_NAME = 'forecast.json';

    public constructor(
        private readonly s3Client: S3Client,
        private readonly bucketName: string
    ) {}

    public async getGeometryJson(polygonID: string): Promise<string> {
        return this.getObject(`${polygonID}/${this.GEOMETRY_FILE_NAME}`);
    }

    public async getForecastJson(polygonID: string): Promise<string> {
        return this.getObject(`${polygonID}/${this.FORECAST_FILE_NAME}`);
    }

    private async getObject(key: string): Promise<string> {
        const response = await this.s3Client.send(
            new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            })
        );
        const jsonStr = await response.Body?.transformToString();

        if (!jsonStr) {
            throw new APIError(500, `object at key: ${key} is empty`);
        }

        return jsonStr;
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public async putGeometryJson(polygonID: string, geometry: any) {
        await this.putObject(
            `${polygonID}/${this.GEOMETRY_FILE_NAME}`,
            geometry
        );
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public async putForecastJson(polygonID: string, forecast: any) {
        await this.putObject(
            `${polygonID}/${this.FORECAST_FILE_NAME}`,
            forecast
        );
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    private async putObject(key: string, object: any) {
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: JSON.stringify(object),
                ContentType: 'application/json; charset=utf-8',
            })
        );
    }
}
