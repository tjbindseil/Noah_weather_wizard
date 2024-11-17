import { ForecastKey, S3Adapter, getForecast } from 'ww-3-utilities-tjb';
import { make_fetch_forcast } from '../../src/forecast_fetcher';
import { publishMetric } from 'ww-3-api-tjb';

jest.mock('ww-3-utilities-tjb', () => ({
    ...jest.requireActual('ww-3-utilities-tjb'),
    getForecast: jest.fn(),
}));
const mockGetForecast = jest.mocked(getForecast);
jest.mock('ww-3-api-tjb');
const mockPublishMetric = jest.mocked(publishMetric);

describe('forecast_fetcher tests', () => {
    const mockGetAllPolygons = jest.fn();
    const mockS3Adapter = {
        getAllPolygons: mockGetAllPolygons,
    } as unknown as S3Adapter;
    const forecastFetchFunc = make_fetch_forcast(mockS3Adapter);

    beforeEach(() => {
        mockGetForecast.mockClear();
        mockPublishMetric.mockClear();
        mockGetAllPolygons.mockClear();
    });

    it('adds a counter when forecast fails to fetch', async () => {
        mockGetForecast.mockRejectedValue(new Error('error'));
        mockGetAllPolygons.mockResolvedValue([new ForecastKey('PID', 4, 20)]);

        await forecastFetchFunc();

        expect(mockPublishMetric).toHaveBeenCalledWith(
            'FORECAST_FETCHER_FAILED_FETCH',
            1
        );
    });
});
