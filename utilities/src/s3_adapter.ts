import {
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import Ajv from 'ajv';
import { APIError } from 'ww-3-api-tjb';
import { _schema, Forecast } from 'ww-3-models-tjb';
import { ForecastKey } from './forecast_key';

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

    public async getGeometryJson(forecastKey: ForecastKey): Promise<string> {
        // I think this is just to make sure the polygons are consistent
        return await this.getObject(
            `${forecastKey.getKeyStr()}/${this.GEOMETRY_FILE_NAME}`
        );
    }

    public async getForecastJson(forecastKey: ForecastKey): Promise<Forecast> {
        const raw = await this.getObject(
            `${forecastKey.getKeyStr()}/${this.FORECAST_FILE_NAME}`
        );
        const asObj = JSON.parse(raw);
        const validator = this.ajv.compile(_schema.Forecast);
        if (!validator(asObj)) {
            console.log(
                `forecastKey is: ${JSON.stringify(
                    forecastKey
                )} validator.errors is: ${JSON.stringify(validator.errors)}`
            );
            console.error(`invalid forecast object: ${JSON.stringify(asObj)}`);
            throw new APIError(500, 'issue with NOAA');
        }

        return asObj as Forecast;
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
    public async putGeometryJson(forecastKey: ForecastKey, geometry: any) {
        await this.putObject(
            `${forecastKey.getKeyStr()}/${this.GEOMETRY_FILE_NAME}`,
            geometry
        );
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public async putForecastJson(forecastKey: ForecastKey, forecast: any) {
        await this.putObject(
            `${forecastKey.getKeyStr()}/${this.FORECAST_FILE_NAME}`,
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

    public async getAllPolygons() {
        const result = await this.s3Client.send(
            new ListObjectsV2Command({
                Bucket: this.bucketName,
            })
        );

        const forecastKeys = new Set<ForecastKey>();

        result.Contents?.forEach((object) => {
            if (!object.Key) {
                console.error('getAllPolygons and key is null');
                return;
            }

            const folderName = object.Key.split('/')[0];
            const folderNameTokens = folderName.split('_');
            forecastKeys.add(
                new ForecastKey(
                    folderNameTokens[0],
                    Number(folderNameTokens[1]),
                    Number(folderNameTokens[2])
                )
            );
        });
        return forecastKeys;
    }
}
