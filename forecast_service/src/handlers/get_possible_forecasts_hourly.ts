import {
    GetPossibleForecastsHourlyInput,
    GetPossibleForecastsHourlyOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { getForecastsHourly } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

export class GetPossibleForecastsHourly extends LooselyAuthenticatedAPI<
    GetPossibleForecastsHourlyInput,
    GetPossibleForecastsHourlyOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetPossibleForecastsHourlyInput);
    }

    constructor() {
        super();
    }

    public async process(
        input: GetPossibleForecastsHourlyInput,
        pgClient: Client
    ): Promise<GetPossibleForecastsHourlyOutput> {
        return {
            forecastsHourly: await getForecastsHourly(pgClient, input.points),
        };
    }
}
