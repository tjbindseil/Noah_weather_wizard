import {
    ForecastKey,
    S3Adapter,
    getForecast,
    getForecastHourly,
} from 'ww-3-utilities-tjb';
import { publishMetric } from 'ww-3-api-tjb';
import { ForecastFetcher } from '../../src/forecast_fetcher';

jest.mock('ww-3-utilities-tjb', () => ({
    ...jest.requireActual('ww-3-utilities-tjb'),
    getForecast: jest.fn(),
    getForecastHourly: jest.fn(),
}));
const mockGetForecast = jest.mocked(getForecast);
const mockGetForecastHourly = jest.mocked(getForecastHourly);
jest.mock('ww-3-api-tjb');
const mockPublishMetric = jest.mocked(publishMetric);

describe('forecast_fetcher tests', () => {
    const mockGetAllPolygons = jest.fn();
    const mockS3Adapter = {
        getAllPolygons: mockGetAllPolygons,
    } as unknown as S3Adapter;
    const forecastFetcher = new ForecastFetcher();

    beforeEach(() => {
        mockGetForecast.mockClear();
        mockGetForecastHourly.mockClear();
        mockPublishMetric.mockClear();
        mockGetAllPolygons.mockClear();
    });

    it('adds a counter when forecast fails to fetch', async () => {
        mockGetForecast.mockRejectedValue(new Error('error'));
        mockGetAllPolygons.mockResolvedValue([new ForecastKey('PID', 4, 20)]);

        await forecastFetcher.fetchForecast(mockS3Adapter);

        expect(mockPublishMetric).toHaveBeenCalledWith(
            'FORECAST_FETCHER_FAILED_FETCH',
            1
        );
    });

    it('adds a counter when forecastHourly fails to fetch', async () => {
        mockGetForecastHourly.mockRejectedValue(new Error('error'));
        mockGetAllPolygons.mockResolvedValue([new ForecastKey('PID', 4, 20)]);

        await forecastFetcher.fetchForecastHourly(mockS3Adapter);

        expect(mockPublishMetric).toHaveBeenCalledWith(
            'FORECAST_FETCHER_FAILED_FETCH',
            1
        );
    });
});
