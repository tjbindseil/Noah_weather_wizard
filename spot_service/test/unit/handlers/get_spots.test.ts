import { GetSpots } from '../../../src/handlers/index';
import { Client } from 'ts-postgres';

import { getSpots } from '../../../src/db/dbo';
jest.mock('../../../src/db/dbo');
const mockGetSpots = jest.mocked(getSpots, true);

describe('GetSpots tests', () => {
    const mockDbClient = {} as unknown as Client;

    beforeEach(() => {
        mockGetSpots.mockClear();
    });

    it('gets the spots', async () => {
        const getSpots = new GetSpots();

        await getSpots.process({}, mockDbClient);

        expect(mockGetSpots).toBeCalledWith(mockDbClient);
    });
});
