import {
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import Ajv from 'ajv';
import { APIError, validate } from 'ww-3-api-tjb';
import { _schema, Forecast, ForecastHourly } from 'ww-3-models-tjb';
import { ForecastKey } from './forecast_key';

export class S3Adapter {
    private readonly FORECAST_FILE_NAME = 'forecast.json';
    private readonly FORECAST_HOURLY_FILE_NAME = 'forecast_hourly.json';

    protected readonly ajv: Ajv;

    public constructor(
        private readonly s3Client: S3Client,
        private readonly bucketName: string
    ) {
        this.ajv = new Ajv({ strict: false });
    }

    public async getForecast(forecastKey: ForecastKey): Promise<Forecast> {
        const raw = await this.getObject(
            `${forecastKey.getKeyStr()}/${this.FORECAST_FILE_NAME}`
        );
        const asObj = JSON.parse(raw);

        return validate<Forecast>(_schema.Forecast, asObj);
    }

    public async getForecastHourly(
        forecastKey: ForecastKey
    ): Promise<ForecastHourly> {
        const raw = await this.getObject(
            `${forecastKey.getKeyStr()}/${this.FORECAST_HOURLY_FILE_NAME}`
        );
        const asObj = JSON.parse(raw);

        return validate<ForecastHourly>(_schema.ForecastHourly, asObj);
    }

    private async getObject(key: string): Promise<string> {
        console.log(`@@ @@ start of getObject, key is: ${key}`);
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

        console.log(`@@ @@ end of getObject, key is: ${key}`);
        return jsonStr;
    }

    public async putForecast(forecastKey: ForecastKey, forecast: Forecast) {
        await this.putObject(
            `${forecastKey.getKeyStr()}/${this.FORECAST_FILE_NAME}`,
            forecast
        );
    }

    public async putForecastHourly(
        forecastKey: ForecastKey,
        forecastHourly: ForecastHourly
    ) {
        await this.putObject(
            `${forecastKey.getKeyStr()}/${this.FORECAST_HOURLY_FILE_NAME}`,
            forecastHourly
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

        const forecastKeys: ForecastKey[] = [];

        result.Contents?.forEach((object) => {
            if (!object.Key) {
                console.error('getAllPolygons and key is null');
                return;
            }

            const folderName = object.Key.split('/')[0];
            const folderNameTokens = folderName.split('_');
            forecastKeys.push(
                new ForecastKey(
                    folderNameTokens[0],
                    Number(folderNameTokens[1]),
                    Number(folderNameTokens[2])
                )
            );
        });

        // sets can contain duplicate objects, even if the objects them selves are identical
        const uniqueFKs = new Set(forecastKeys.map((fk) => JSON.stringify(fk)));
        return Array.from(uniqueFKs).map((fk) => {
            const asObj = JSON.parse(fk);
            return new ForecastKey(asObj.polygonID, asObj.gridX, asObj.gridY);
        });
    }

    public async deleteForecast(forecastKey: ForecastKey) {
        const raw = await this.getObject(
            `${forecastKey.getKeyStr()}/${this.FORECAST_FILE_NAME}`
        );
        const asObj = JSON.parse(raw);

        return validate<Forecast>(_schema.Forecast, asObj);
    }
}
