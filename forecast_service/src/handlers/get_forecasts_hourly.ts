import {
    GetForecastsHourlyInput,
    GetForecastsHourlyOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { getForecastsHourly } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

export class GetForecastsHourly extends LooselyAuthenticatedAPI<
    GetForecastsHourlyInput,
    GetForecastsHourlyOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetForecastsHourlyInput);
    }

    constructor() {
        super();
    }

    public async process(
        input: GetForecastsHourlyInput,
        pgClient: Client
    ): Promise<GetForecastsHourlyOutput> {
        return {
            forecastsHourly: await getForecastsHourly(pgClient, input.pointIDs),
        };
    }
}
