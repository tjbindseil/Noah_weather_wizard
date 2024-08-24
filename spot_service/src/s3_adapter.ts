import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { APIError } from 'ww-3-api-tjb';

export default class S3Adapter {
    private readonly GEOMETRY_FILE_NAME = 'geometry.json';
    private readonly FORECAST_FILE_NAME = 'forecast.json';

    public constructor(
        private readonly s3Client: S3Client,
        private readonly bucketName: string
    ) {}

    public async getGeometryJson(polygonID: string): Promise<string> {
        const response = await this.s3Client.send(
            new GetObjectCommand({
                Bucket: this.bucketName,
                Key: `${polygonID}/${this.GEOMETRY_FILE_NAME}`,
            })
        );
        const geometryJsonStr = await response.Body?.transformToString();

        if (!geometryJsonStr) {
            throw new APIError(500, 'geometry is empty');
        }

        return geometryJsonStr;
    }

    public async putGeometryJson(polygonID: string, geometry: any) {
        await this.putObject(
            `${polygonID}/${this.GEOMETRY_FILE_NAME}`,
            geometry
        );
    }

    public async putForecastJson(polygonID: string, forecast: any) {
        await this.putObject(
            `${polygonID}/${this.FORECAST_FILE_NAME}`,
            forecast
        );
    }

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
