import { PostSpot } from '../../../src/handlers/index';
import { Client } from 'ts-postgres';
import { APIError } from 'ww-3-api-tjb';
import { Forecast } from 'ww-3-models-tjb';

import {
    makeInitialCall,
    getForecast,
    S3Adapter,
    insertSpot,
    ForecastKey,
} from 'ww-3-utilities-tjb';
jest.mock('ww-3-utilities-tjb', () => ({
    ...jest.requireActual('ww-3-utilities-tjb'),
    insertSpot: jest.fn(),
    makeInitialCall: jest.fn(),
    getForecast: jest.fn(),
}));
const mockInsertSpot = jest.mocked(insertSpot, true);
const mockMakeInitialCall = jest.mocked(makeInitialCall, true);
const mockGetForecast = jest.mocked(getForecast, true);

describe('PostSpot tests', () => {
    const mockDbClient = {} as unknown as Client;

    const mockGetGeometryJson = jest.fn();
    const mockPutForecastJson = jest.fn();
    const mockPutGeometryJson = jest.fn();
    const mockS3Adapter = {
        getGeometryJson: mockGetGeometryJson,
        putForecastJson: mockPutForecastJson,
        putGeometryJson: mockPutGeometryJson,
    } as unknown as S3Adapter;

    const postedSpot = { name: 'name', latitude: 1, longitude: 2 };
    const polygonID = 'ABC';
    const gridX = 420;
    const gridY = 69;
    const forecastKey = new ForecastKey(polygonID, gridX, gridY);
    const forecast = { forecast: 'clear' } as unknown as Forecast;
    const existingGeometry = { g: 'om' };

    const postSpot = new PostSpot(mockS3Adapter);

    beforeEach(() => {
        mockGetGeometryJson.mockClear();
        mockPutForecastJson.mockClear();
        mockPutGeometryJson.mockClear();

        mockInsertSpot.mockClear();
        mockMakeInitialCall.mockClear();
        mockGetForecast.mockClear();

        mockGetGeometryJson.mockResolvedValue(JSON.stringify(existingGeometry));
        mockGetForecast.mockResolvedValue([forecast, existingGeometry]);
        mockMakeInitialCall.mockResolvedValue(forecastKey);
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

        expect(mockMakeInitialCall).toBeCalledWith(trimmedLat, trimmedLong);
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

    it.skip('checks the presence of geometry, and if already present but different, throws 500', async () => {
        const fetchedGeometry = { g: 'DIFFERENT' };
        mockGetForecast.mockClear();
        mockGetForecast.mockResolvedValue([
            'unused' as unknown as Forecast,
            fetchedGeometry,
        ]);

        await expect(
            postSpot.process(postedSpot, mockDbClient)
        ).rejects.toThrow(new APIError(500, 'assumptions failed'));
    });

    it.skip('checks the presence of geometry, and if not already present, saves the geometry and forecast before inserting the spot into the database', async () => {
        mockGetGeometryJson.mockClear();
        mockGetGeometryJson.mockRejectedValue({ name: 'NoSuchKey' });

        await postSpot.process(postedSpot, mockDbClient);

        expect(mockPutForecastJson).toBeCalledWith(forecastKey, forecast);
        expect(mockPutGeometryJson).toBeCalledWith(
            forecastKey,
            existingGeometry
        );
        expect(mockInsertSpot).toBeCalledWith(mockDbClient, {
            ...postedSpot,
            polygonID: forecastKey.polygonID,
            gridX: forecastKey.gridX,
            gridY: forecastKey.gridY,
        });
    });

    it('bubbles up other errors that occur when getting geometry', async () => {
        const unexpectedError = new Error('NOT_NoSuchKey');
        mockGetGeometryJson.mockClear();
        mockGetGeometryJson.mockRejectedValue(unexpectedError);

        await expect(
            postSpot.process(postedSpot, mockDbClient)
        ).rejects.toThrow(unexpectedError);
    });
});
