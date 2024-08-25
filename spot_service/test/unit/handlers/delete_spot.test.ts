import { DeleteSpot } from '../../../src/handlers/index';
import { Client } from 'ts-postgres';

import { deleteSpot } from '../../../src/db/dbo';
jest.mock('../../../src/db/dbo');
const mockDeleteSpot = jest.mocked(deleteSpot, true);

describe('DeleteSpot tests', () => {
    const mockDbClient = {} as unknown as Client;
    const id = 42;

    beforeEach(() => {
        mockDeleteSpot.mockClear();
    });

    it('deletes the spot', async () => {
        const deleteSpot = new DeleteSpot();

        await deleteSpot.process({ id }, mockDbClient);

        expect(mockDeleteSpot).toBeCalledWith(mockDbClient, id);
    });
});
