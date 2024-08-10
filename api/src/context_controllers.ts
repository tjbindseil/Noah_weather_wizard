import { Client } from 'ts-postgres';
import { Pool } from 'generic-pool';

export abstract class ContextController<C> {
    public abstract acquire(): Promise<C>;
    public abstract release(c: C): Promise<void>;
}

export class PGContextController extends ContextController<Client> {
    constructor(private readonly pool: Pool<Client>) {
        super();
    }

    public async acquire() {
        return await this.pool.acquire();
    }

    public async release(pgClient: Client) {
        await this.pool.release(pgClient);
    }
}

// some apis don't need to connect to connect to postgres, this is an opt out
export class UnusedContextController extends ContextController<unknown> {
    public async acquire() {
        return {};
    }

    public release(_u: unknown): Promise<void> {
        return Promise.resolve();
    }
}
