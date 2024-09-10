import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import Ajv from 'ajv';
import { APIError } from 'ww-3-api-tjb';
import { _schema, Forecast } from 'ww-3-models-tjb';

export class S3Adapter {
    private readonly GEOMETRY_FILE_NAME = 'geometry.json';
    private readonly FORECAST_FILE_NAME = 'forecast.json';

    protected readonly ajv: Ajv;

    public constructor(
        private readonly s3Client: S3Client,
        private readonly bucketName: string
    ) {
        this.ajv = new Ajv({ strict: false });
    }

    public async getGeometryJson(polygonID: string): Promise<string> {
        // I think this is just to make sure the polygons are consistent
        return this.getObject(`${polygonID}/${this.GEOMETRY_FILE_NAME}`);
    }

    public async getForecastJson(polygonID: string): Promise<Forecast> {
        const raw = this.getObject(`${polygonID}/${this.FORECAST_FILE_NAME}`);
        const validator = this.ajv.compile(_schema.Forecast);
        if (!validator(raw)) {
            console.error(`invalid forecast object: ${JSON.stringify(raw)}`);
            throw new APIError(500, 'issue with NOAA');
        }

        return raw as Forecast;
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
