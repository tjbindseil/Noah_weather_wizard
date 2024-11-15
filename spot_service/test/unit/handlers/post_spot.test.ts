import { PostSpot } from '../../../src/handlers/index';
import { Client } from 'ts-postgres';
import { Forecast } from 'ww-3-models-tjb';

import {
    getForecastKey,
    getForecast,
    S3Adapter,
    insertSpot,
    ForecastKey,
} from 'ww-3-utilities-tjb';
jest.mock('ww-3-utilities-tjb', () => ({
    ...jest.requireActual('ww-3-utilities-tjb'),
    insertSpot: jest.fn(),
    getForecastKey: jest.fn(),
    getForecast: jest.fn(),
}));
const mockInsertSpot = jest.mocked(insertSpot, true);
const mockGetForecastKey = jest.mocked(getForecastKey, true);
const mockGetForecast = jest.mocked(getForecast, true);

describe('PostSpot tests', () => {
    const mockDbClient = {} as unknown as Client;

    const mockPutForecastJson = jest.fn();
    const mockPutGeometryJson = jest.fn();
    const mockS3Adapter = {
        putForecastJson: mockPutForecastJson,
        putGeometryJson: mockPutGeometryJson,
    } as unknown as S3Adapter;

    const postedSpot = { name: 'name', latitude: 1, longitude: 2 };
    const polygonID = 'ABC';
    const gridX = 420;
    const gridY = 69;
    const forecastKey = new ForecastKey(polygonID, gridX, gridY);
    const forecast = { forecast: 'clear' } as unknown as Forecast;

    const postSpot = new PostSpot(mockS3Adapter);

    beforeEach(() => {
        mockPutForecastJson.mockClear();
        mockPutGeometryJson.mockClear();

        mockInsertSpot.mockClear();
        mockGetForecastKey.mockClear();
        mockGetForecast.mockClear();

        mockGetForecast.mockResolvedValue(forecast);
        mockGetForecastKey.mockResolvedValue(forecastKey);
    });

    it('trims lat and long before using them', async () => {
        const untrimmedPostedSpot = {
            name: 'name',
            latitude: 1.1111111,
            longitude: 2.2222222222,
        };
        const trimmedLat = 1.1111;
        const trimmedLong = 2.2222;

        await postSpot.process(untrimmedPostedSpot, mockDbClient);

        expect(mockGetForecastKey).toBeCalledWith(trimmedLat, trimmedLong);
        expect(mockInsertSpot).toBeCalledWith(mockDbClient, {
            name: untrimmedPostedSpot.name,
            latitude: trimmedLat,
            longitude: trimmedLong,
            polygonID,
            gridX,
            gridY,
        });
    });

    it.skip('checks the presence of geometery, and if already present and unchanged, posts the spot to the db', async () => {
        await postSpot.process(postedSpot, mockDbClient);

        expect(mockInsertSpot).toBeCalledWith(mockDbClient, {
            ...postedSpot,
            polygonID: forecastKey.polygonID,
            gridX: forecastKey.gridX,
            gridY: forecastKey.gridY,
        });
    });

    it.skip('bubbles up other errors that occur when getting geometry', async () => {
        const unexpectedError = new Error('NOT_NoSuchKey');

        await expect(
            postSpot.process(postedSpot, mockDbClient)
        ).rejects.toThrow(unexpectedError);
    });
});
