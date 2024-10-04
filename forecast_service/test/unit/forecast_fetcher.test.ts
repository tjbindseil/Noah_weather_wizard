import { Pool } from 'generic-pool';
import { Client } from 'ts-postgres';
import { make_fetch_forcast } from '../../src/forecast_fetcher';
import { S3Adapter } from 'ww-3-utilities-tjb';

describe('forecasts_hourly tests', () => {
    const mockPool = {} as unknown as Pool<Client>;
    const mockS3Adapter = {} as unknown as S3Adapter;
    const _forecastFetchFunction = make_fetch_forcast(mockPool, mockS3Adapter);

    it('fetches all forecasts', async () => {
        // I'm not sure I want to write this test right now
    });
});
