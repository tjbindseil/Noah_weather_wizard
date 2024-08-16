import {
    Forecast,
    GetRankedForecastsInput,
    GetRankedForecastsOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { getForecasts } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import { Processor } from '../processors/processor';

export class GetRankedForecasts extends LooselyAuthenticatedAPI<
    GetRankedForecastsInput,
    GetRankedForecastsOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetRankedForecastsInput);
    }

    constructor(private readonly forecastProcessor: Processor<Forecast>) {
        super();
    }

    public async process(
        input: GetRankedForecastsInput,
        pgClient: Client
    ): Promise<GetRankedForecastsOutput> {
        return {
            forecasts: this.forecastProcessor.rank(
                await getForecasts(pgClient, input.points),
                input.formulaID
            ),
        };
    }
}
