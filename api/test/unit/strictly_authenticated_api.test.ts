import {
    makeReqRes,
    mockNext,
    mockPool,
    TestStrictlyAuthenticatedAPI,
    mockAcquire,
    fakeClient,
    mockRelease,
} from './api_helpers';

import { makeCognitoJWTAuthenticator } from '../../src/auth';

jest.mock('../../src/auth');
const mockMakeCognitoJWTAuthenticator = jest.mocked(
    makeCognitoJWTAuthenticator,
    { shallow: true }
);

describe('StrictlyAuthenticatedAPI tests', () => {
    const expectedDecodedUsername = 'expectedDecodedUsername';
    const mockJWTAuthenticator = jest.fn();
    mockMakeCognitoJWTAuthenticator.mockReturnValue(mockJWTAuthenticator);

    let api: TestStrictlyAuthenticatedAPI;

    beforeEach(() => {
        (mockNext as jest.Mock).mockClear();
        mockAcquire.mockClear();
        mockAcquire.mockResolvedValue(fakeClient);
        mockRelease.mockClear();
        mockJWTAuthenticator.mockClear();
        mockJWTAuthenticator.mockResolvedValue(expectedDecodedUsername);
        api = new TestStrictlyAuthenticatedAPI(true);
    });

    it('passes the auth header to the jwt authenticator', async () => {
        const [req, res] = makeReqRes();
        await api.call(req, res, mockNext, mockPool);
        expect(mockJWTAuthenticator).toHaveBeenCalledWith(
            req.headers.authorization
        );
    });

    it('saves the decoded username returned by the authenticator', async () => {
        const [req, res] = makeReqRes();
        await api.call(req, res, mockNext, mockPool);
        expect(api.checkUsername()).toEqual(expectedDecodedUsername);
    });
});
