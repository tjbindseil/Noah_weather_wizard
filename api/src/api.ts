import { NextFunction, Request, Response } from 'express';
import { APIError } from './api_error';
import Ajv, { ValidateFunction } from 'ajv';
import { ContextController } from './context_controllers';

export abstract class API<I, O, C> {
    protected readonly ajv: Ajv;

    constructor() {
        this.ajv = new Ajv({ strict: false });
    }

    public async call(
        req: Request<unknown, O, I>,
        res: Response,
        next: NextFunction,
        contextController: ContextController<C>
    ) {
        const context = await contextController.acquire();

        try {
            const validator = this.provideInputValidationSchema();

            let input;
            if (req.method === 'GET') {
                input = req.query;
            } else {
                input = req.body;
            }

            if (!validator(input)) {
                console.error(`input is: ${JSON.stringify(input)}`);
                throw new APIError(400, 'invalid input');
            }

            const castedInput = input as unknown as I;

            const output = await this.process(castedInput, context);
            const serialized_output = this.serializeOutput(output);

            res.set('Content-Type', this.getContentType());
            res.status(200);
            res.send(serialized_output);
        } catch (error: unknown) {
            if (error instanceof APIError) {
                next(error);
            } else {
                console.error('generic failure to handle request');
                console.error(error);
                next(new APIError(500, 'generic failure to handle request'));
            }
        } finally {
            await contextController.release(context);
        }
    }

    // TODO I think this should jsut validate the input, then this module can be agnostic of how thats done
    public abstract provideInputValidationSchema(): ValidateFunction;
    public abstract process(input: I, context: C): Promise<O>;

    public getContentType(): string {
        return 'application/json';
    }

    public serializeOutput(output: O): string | Buffer {
        // TODO verify with ajv
        return JSON.stringify(output);
    }
}
