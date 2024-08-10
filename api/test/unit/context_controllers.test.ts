import { Pool } from 'generic-pool';
import { Client } from 'ts-postgres';
import { PGContextController, UnusedContextController } from '../../src';

describe('ContextController tests', () => {
    it('tests UnusedContextController', async () => {
        // just run the code
        const unusedContextController = new UnusedContextController();
        const unusedContext = await unusedContextController.acquire();
        await unusedContextController.release(unusedContext);
    });
});

describe('PGContextController tests', () => {
    const fakeClient = 'fakeClient';
    const mockAcquire = jest.fn();
    const mockRelease = jest.fn();

    const mockPool = {
        acquire: mockAcquire,
        release: mockRelease,
    } as unknown as Pool<Client>;

    const pgClientContextController = new PGContextController(mockPool);

    beforeEach(() => {
        mockAcquire.mockClear();
        mockAcquire.mockResolvedValue(fakeClient);
        mockRelease.mockClear();
    });

    it('acquires context from the supplied pool', async () => {
        const client = await pgClientContextController.acquire();
        expect(client).toEqual(fakeClient);
    });

    it('releases the context via the supplied pool', async () => {
        await pgClientContextController.release(
            fakeClient as unknown as Client
        );
        expect(mockRelease).toHaveBeenCalledWith(fakeClient);
    });
});
