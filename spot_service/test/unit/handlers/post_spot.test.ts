import { PostSpot } from '../../../src/handlers/index';
import { Client } from 'ts-postgres';

import { insertSpot } from '../../../src/db/dbo';
jest.mock('../../../src/db/dbo');
const mockInsertSpot = jest.mocked(insertSpot, true);

import { getPolygonID } from '../../../src/noaa_api';
jest.mock('../../../src/noaa_api');
const mockGetPolygonID = jest.mocked(getPolygonID, true);

describe('PostSpot tests', () => {
    const mockDbClient = {} as unknown as Client;
    const postedSpot = { name: 'name', latitude: 1, longitude: 2 };
    const polygonID = 'ABC';

    beforeEach(() => {
        mockInsertSpot.mockClear();
        mockGetPolygonID.mockClear();

        mockGetPolygonID.mockResolvedValue(polygonID);
    });

    it.skip('posts the spot', async () => {
        //         const postSpot = new PostSpot();
        //
        //         await postSpot.process(postedSpot, mockDbClient);
        //
        //         expect(mockInsertSpot).toBeCalledWith(mockDbClient, {
        //             ...postedSpot,
        //             polygonID,
        //         });
    });
});
