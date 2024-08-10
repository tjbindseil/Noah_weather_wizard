import { Request, Response } from 'express';
import { myErrorHandler } from '../../../src/middleware/error_handler';
import { APIError } from '../../../src/api_error';

describe('error_handler tests', () => {
    it('handels APIError', () => {
        const statusCode = 420;
        const message = 'blaze it yo';
        const err = new APIError(statusCode, message);

        const resRef = {
            status: jest.fn(),
            set: jest.fn(),
            send: jest.fn(),
        };
        const res = resRef as unknown as Response;

        myErrorHandler(err, jest.fn() as unknown as Request, res, jest.fn());

        expect(resRef.set).toHaveBeenCalledWith(
            'Content-Type',
            'application/json'
        );
        expect(resRef.status).toHaveBeenCalledWith(statusCode);
        expect(resRef.send).toHaveBeenCalledWith({ message: message });
    });

    it('handles non-APIErrors', () => {
        const message = 'blaze it yo';
        const err = new Error(message);

        const resRef = {
            status: jest.fn(),
            set: jest.fn(),
            send: jest.fn(),
        };
        const res = resRef as unknown as Response;

        myErrorHandler(err, jest.fn() as unknown as Request, res, jest.fn());

        expect(resRef.set).toHaveBeenCalledWith(
            'Content-Type',
            'application/json'
        );
        expect(resRef.status).toHaveBeenCalledWith(500);
        expect(resRef.send).toHaveBeenCalledWith({ message: 'unknown error' });
    });
});
