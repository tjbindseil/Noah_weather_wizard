import { PostSpot } from '../../../src/handlers/index';
import { Client } from 'ts-postgres';

import { insertSpot } from '../../../src/db/dbo';
jest.mock('../../../src/db/dbo');
const mockInsertSpot = jest.mocked(insertSpot, true);

import { makeInitialCall, getForecast } from '../../../src/noaa_api';
import S3Adapter from '../../../src/s3_adapter';
jest.mock('../../../src/noaa_api');
const mockMakeInitialCall = jest.mocked(makeInitialCall, true);
const mockGetForecast = jest.mocked(getForecast, true);

describe('PostSpot tests', () => {
    const mockDbClient = {} as unknown as Client;

    getGeometryJson, putForecastJson, putGeometryJson;
    const mockS3Adapter = {} as unknown as S3Adapter;

    const postedSpot = { name: 'name', latitude: 1, longitude: 2 };
    const polygonID = 'ABC';
    const forecastUrl = 'forecastURL';

    beforeEach(() => {
        mockInsertSpot.mockClear();
        mockMakeInitialCall.mockClear();
        mockGetForecast.mockClear();

        mockMakeInitialCall.mockResolvedValue([polygonID, forecastUrl]);
    });

    it('posts the spot', async () => {
        const postSpot = new PostSpot(mockS3Adapter);

        await postSpot.process(postedSpot, mockDbClient);

        expect(mockInsertSpot).toBeCalledWith(mockDbClient, {
            ...postedSpot,
            polygonID,
        });
    });

    // it trims the lat/long input to 4 decimals
    //
    // when getting the existing geometry, if it doesn't exist, it gets the geometry and forecast and saves those to s3
    //
    // when getting the existing geometry, if it does exist, it compareas the existiung to the latest fetched geometry and throws when they are different
    //
    // when there is an issue getting the existing geometry (other than 404), the error is bubbled up
});
