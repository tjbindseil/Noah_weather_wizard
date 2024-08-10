import {
    makeReqRes,
    mockNext,
    mockPool,
    mockAcquire,
    fakeClient,
    mockRelease,
    TestLooselyAuthenticatedAPI,
} from './api_helpers';

import { makeCognitoJWTAuthenticator } from '../../src/auth';

jest.mock('../../src/auth');
const mockMakeCognitoJWTAuthenticator = jest.mocked(
    makeCognitoJWTAuthenticator,
    { shallow: true }
);

describe('LooselyAuthenticatedAPI tests', () => {
    const expectedDecodedUsername = 'expectedDecodedUsername';
    const mockJWTAuthenticator = jest.fn();
    mockMakeCognitoJWTAuthenticator.mockReturnValue(mockJWTAuthenticator);

    let api: TestLooselyAuthenticatedAPI;

    beforeEach(() => {
        (mockNext as jest.Mock).mockClear();
        mockAcquire.mockClear();
        mockAcquire.mockResolvedValue(fakeClient);
        mockRelease.mockClear();
        mockJWTAuthenticator.mockClear();
        mockJWTAuthenticator.mockResolvedValue(expectedDecodedUsername);
        api = new TestLooselyAuthenticatedAPI(true);
    });

    it('passes the auth header to the jwt authenticator', async () => {
        const [req, res] = makeReqRes();
        await api.call(req, res, mockNext, mockPool);
        expect(mockJWTAuthenticator).toHaveBeenCalledWith(
            req.headers.authorization
        );
    });

    it('sets the validatedUsername when the auth header is correct', async () => {
        const [req, res] = makeReqRes();
        await api.call(req, res, mockNext, mockPool);
        expect(api.checkUsername()).toEqual(expectedDecodedUsername);
    });

    it('silently leaves the validatedUsername undefined when auth header is missing/malformed/invalid', async () => {
        const [req, res] = makeReqRes();
        mockJWTAuthenticator.mockRejectedValue(
            new Error('ANY ERROR IS SWALLOWED')
        );
        await api.call(req, res, mockNext, mockPool);
        expect(api.checkUsername()).toBeUndefined();
    });
});
