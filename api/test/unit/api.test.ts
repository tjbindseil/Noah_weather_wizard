import { Response } from 'express';
import { APIError } from '../../src/api_error';
import {
    mockAcquire,
    fakeClient,
    mockRelease,
    mockNext,
    TestAPI,
    makeReqRes,
    mockPool,
    serializedSpecialOutput,
    specialGetApiCallInput,
    serializedSpecialGetApiCallOutput,
    specialOutput,
} from './api_helpers';

describe('API Tests', () => {
    let api: TestAPI;
    beforeEach(() => {
        (mockNext as jest.Mock).mockClear();
        mockAcquire.mockClear();
        mockAcquire.mockResolvedValue(fakeClient);
        mockRelease.mockClear();
        api = new TestAPI();
    });

    it('calls', async () => {
        const [req, res] = makeReqRes();
        await api.call(req, res, mockNext, mockPool);
        expect(res.set).toHaveBeenCalledWith(
            'Content-Type',
            'application/json'
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(serializedSpecialOutput);
    });

    it('gets input from query params when GET call is made', async () => {
        const [req, res] = makeReqRes();
        req.method = 'GET';
        req.query = specialGetApiCallInput;
        await api.call(req, res, mockNext, mockPool);
        expect(res.set).toHaveBeenCalledWith(
            'Content-Type',
            'application/json'
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            serializedSpecialGetApiCallOutput
        );
    });

    it('client is acquired from pool, used in process, and released', async () => {
        const [req, res] = makeReqRes();
        await api.call(req, res, mockNext, mockPool);
        expect(res.set).toHaveBeenCalledWith(
            'Content-Type',
            'application/json'
        );
        expect(mockRelease).toHaveBeenCalledWith(fakeClient);
    });

    it('returns a 400 error upon invalid input', async () => {
        const [req, _res] = makeReqRes();
        const res = {
            set: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        } as unknown as Response;

        const apiProgrammedToFailValidation = new TestAPI(false);
        apiProgrammedToFailValidation.getMockValidator().mockReturnValue(false);

        await apiProgrammedToFailValidation.call(req, res, mockNext, mockPool);

        expect(mockNext).toHaveBeenCalledWith(
            new APIError(400, 'invalid input')
        );
        expect(res.set).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledTimes(0);
        expect(res.send).toHaveBeenCalledTimes(0);
    });

    it('intercepts and returns generic 500 when unknown exception occurs during call', async () => {
        const [req, res] = makeReqRes();
        const apiWithGenericException = new TestAPI(true, true);
        await apiWithGenericException.call(req, res, mockNext, mockPool);

        expect(mockNext).toHaveBeenCalledWith(
            new APIError(500, 'generic failure to handle request')
        );
        expect(res.set).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledTimes(0);
        expect(res.send).toHaveBeenCalledTimes(0);
    });

    it('passes api exceptions to middleware when they occur during call', async () => {
        const [req, res] = makeReqRes();
        const apiWithGenericException = new TestAPI(false, true);
        await apiWithGenericException.call(req, res, mockNext, mockPool);

        expect(mockNext).toHaveBeenCalledWith(
            new APIError(444, 'an actual APIError')
        );
        expect(res.set).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledTimes(0);
        expect(res.send).toHaveBeenCalledTimes(0);
    });

    it('gives json content type by default', () => {
        const contentType = api.getContentType();
        expect(contentType).toEqual('application/json');
    });

    it('uses JSON.stringify to serialize output by default', () => {
        const resultingSerializedOutput = api.serializeOutput(specialOutput);
        expect(resultingSerializedOutput).toEqual(serializedSpecialOutput);
    });
});
