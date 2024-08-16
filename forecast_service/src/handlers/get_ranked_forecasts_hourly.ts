import {
    GetRankedForecastsHourlyInput,
    GetRankedForecastsHourlyOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { getForecastsHourly } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

export class GetRankedForecastsHourly extends LooselyAuthenticatedAPI<
    GetRankedForecastsHourlyInput,
    GetRankedForecastsHourlyOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetRankedForecastsHourlyInput);
    }

    constructor() {
        super();
    }

    public async process(
        input: GetRankedForecastsHourlyInput,
        pgClient: Client
    ): Promise<GetRankedForecastsHourlyOutput> {
        return {
            forecastsHourly: await getForecastsHourly(pgClient, input.points),
        };
    }
}
