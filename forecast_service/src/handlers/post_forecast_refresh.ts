import {
    PostForecastRefreshInput,
    PostForecastRefreshOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import {
    ForecastKey,
    getForecast,
    getForecastHourly,
    getSpot,
    S3Adapter,
} from 'ww-3-utilities-tjb';

export class PostForecastRefresh extends LooselyAuthenticatedAPI<
    PostForecastRefreshInput,
    PostForecastRefreshOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostForecastRefreshInput);
    }

    constructor(private readonly s3Adapter: S3Adapter) {
        super();
    }

    public async process(
        input: PostForecastRefreshInput,
        pgClient: Client
    ): Promise<PostForecastRefreshOutput> {
        const spot = await getSpot(pgClient, input.spotId);
        const fk = new ForecastKey(spot.polygonID, spot.gridX, spot.gridY);
        const forecast = await getForecast(fk);
        const forecastHourly = await getForecastHourly(fk);
        await this.s3Adapter.putForecast(fk, forecast);
        await this.s3Adapter.putForecastHourly(fk, forecastHourly);

        return {};
    }
}
