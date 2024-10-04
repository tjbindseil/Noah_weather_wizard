import { make_fetch_forcast } from '../../src/forecast_fetcher';
import { S3Adapter } from 'ww-3-utilities-tjb';

describe('forecasts_hourly tests', () => {
    const mockS3Adapter = {} as unknown as S3Adapter;
    const _forecastFetchFunction = make_fetch_forcast(mockS3Adapter);

    it('fetches all forecasts', async () => {
        // I'm not sure I want to write this test right now
    });
});
