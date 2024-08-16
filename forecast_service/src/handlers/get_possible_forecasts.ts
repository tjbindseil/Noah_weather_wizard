import {
    Forecast,
    GetPossibleForecastsInput,
    GetPossibleForecastsOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { getForecasts } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import { Processor } from '../processors/processor';

export class GetPossibleForecasts extends LooselyAuthenticatedAPI<
    GetPossibleForecastsInput,
    GetPossibleForecastsOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetPossibleForecastsInput);
    }

    constructor(private readonly forecastProcessor: Processor<Forecast>) {
        super();
    }

    public async process(
        input: GetPossibleForecastsInput,
        pgClient: Client
    ): Promise<GetPossibleForecastsOutput> {
        return {
            forecasts: this.forecastProcessor.filter(
                await getForecasts(pgClient, input.points),
                input.criteriaID
            ),
        };
    }
}
