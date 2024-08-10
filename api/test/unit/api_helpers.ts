import { NextFunction, Request, Response } from 'express';
import { API, APIError, LooselyAuthenticatedAPI } from '../../src';
import { ValidateFunction } from 'ajv';
import { StrictlyAuthenticatedAPI } from '../../src/strictly_authenticated_api';
import { ContextController } from '../../src/context_controllers';

export const specialInput = { test: 'SPECIAL_INPUT' };
export const specialGetApiCallInput = { test: 'SPECIAL_GET_INPUT' };
export const specialOutput = { test: 'SPECIAL_OUTPUT' };
export const specialGetApiCallOutput = { test: 'SPECIAL_GET_OUTPUT' };
export const serializedSpecialOutput = JSON.stringify(specialOutput);
export const serializedSpecialGetApiCallOutput = JSON.stringify(
    specialGetApiCallOutput
);

export class TestAPI extends API<
    { [key: string]: string },
    { [key: string]: string },
    string
> {
    throwGenericFailure: boolean;
    throwAPIErrorFailure: boolean;
    private readonly mockValidator: jest.Mock;

    constructor(throwGenericFailure?: boolean, throwAPIErrorFailure?: boolean) {
        super();
        this.throwGenericFailure = throwGenericFailure ?? false;
        this.throwAPIErrorFailure = throwAPIErrorFailure ?? false;

        this.mockValidator = jest.fn();
        this.mockValidator.mockReturnValue(true);
    }

    public provideInputValidationSchema(): ValidateFunction {
        return this.mockValidator as unknown as ValidateFunction;
    }

    public getMockValidator() {
        return this.mockValidator;
    }

    public async process(
        input: {
            [key: string]: string;
        },
        _context: string
    ): Promise<{ [key: string]: string }> {
        if (this.throwGenericFailure) {
            throw new Error('message');
        }
        if (this.throwAPIErrorFailure) {
            throw new APIError(444, 'an actual APIError');
        }

        if (input === specialInput) {
            return specialOutput;
        } else if (input === specialGetApiCallInput) {
            return specialGetApiCallOutput;
        } else {
            return {};
        }
    }
}

export class TestStrictlyAuthenticatedAPI extends StrictlyAuthenticatedAPI<
    { [key: string]: string },
    { [key: string]: string },
    string
> {
    validatorReturnValue: boolean;

    constructor(validatorReturnValue: boolean) {
        super();
        this.validatorReturnValue = validatorReturnValue;
    }

    public provideInputValidationSchema(): ValidateFunction {
        const validator = jest.fn();
        validator.mockReturnValue(this.validatorReturnValue);
        return validator as unknown as ValidateFunction;
    }

    public async process(
        _input: {
            [key: string]: string;
        },
        _context: string
    ): Promise<{ [key: string]: string }> {
        return {};
    }

    public checkUsername() {
        return this.validatedUsername;
    }
}

export class TestLooselyAuthenticatedAPI extends LooselyAuthenticatedAPI<
    { [key: string]: string },
    { [key: string]: string },
    string
> {
    validatorReturnValue: boolean;

    constructor(validatorReturnValue: boolean) {
        super();
        this.validatorReturnValue = validatorReturnValue;
    }

    public provideInputValidationSchema(): ValidateFunction {
        const validator = jest.fn();
        validator.mockReturnValue(this.validatorReturnValue);
        return validator as unknown as ValidateFunction;
    }

    public async process(
        _input: {
            [key: string]: string;
        },
        _context: string
    ): Promise<{ [key: string]: string }> {
        return {};
    }

    public checkUsername() {
        return this.validatedUsername;
    }
}

export const makeReqRes = (): [Request, Response] => {
    const req = {
        body: specialInput,
        headers: {
            authorization: 'AUTH_HEADER',
        },
    } as Request;
    const res = {
        set: jest.fn(),
        status: jest.fn(),
        send: jest.fn(),
    } as unknown as Response;

    return [req, res];
};

export const mockNext = jest.fn() as unknown as NextFunction;

export const fakeClient = 'fakeClient';
export const mockAcquire = jest.fn();
export const mockRelease = jest.fn();

export const mockPool = {
    acquire: mockAcquire,
    release: mockRelease,
} as unknown as ContextController<string>;
