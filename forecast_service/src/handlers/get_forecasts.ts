import {
    GetForecastsInput,
    GetForecastsOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { getForecasts } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

export class GetForecasts extends LooselyAuthenticatedAPI<
    GetForecastsInput,
    GetForecastsOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetForecastsInput);
    }

    constructor() {
        super();
    }

    public async process(
        input: GetForecastsInput,
        pgClient: Client
    ): Promise<GetForecastsOutput> {
        return {
            forecasts: await getForecasts(pgClient, input.pointIDs),
        };
    }
}
