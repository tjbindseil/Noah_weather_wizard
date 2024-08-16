import {
    GetRankedForecastsInput,
    GetRankedForecastsOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { getForecasts } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

export class GetRankedForecasts extends LooselyAuthenticatedAPI<
    GetRankedForecastsInput,
    GetRankedForecastsOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetRankedForecastsInput);
    }

    constructor() {
        super();
    }

    public async process(
        input: GetRankedForecastsInput,
        pgClient: Client
    ): Promise<GetRankedForecastsOutput> {
        return {
            // TODO apply ranked processor here
            forecasts: await getForecasts(pgClient, input.points),
        };
    }
}
