import { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';
import { makeCognitoJWTAuthenticator } from '../../src/auth';
import { APIError } from '../../src';

describe('auth tests', () => {
    const reqNoAuthHeader = undefined;
    const reqWithIncorrectlyFormattedAuthHeader = 'authorization';
    const actualToken = 'authorization_token';
    const reqWithAuthHeader = `Bearer: ${actualToken}`;

    const expectedVerifierReturnValue = {
        username: 'expected',
    };
    const mockVerify = jest.fn();
    const mockVerifier = {
        verify: mockVerify,
    } as unknown as CognitoJwtVerifierSingleUserPool<{
        userPoolId: string;
        tokenUse: 'access';
        clientId: string;
    }>;

    const authMiddleware = makeCognitoJWTAuthenticator(mockVerifier);

    beforeEach(() => {
        mockVerify.mockClear();
        mockVerify.mockReturnValue(expectedVerifierReturnValue);
    });

    it('calls next with error when auth header is not present', async () => {
        await expect(authMiddleware(reqNoAuthHeader)).rejects.toThrow(
            new APIError(401, 'no auth credentials provided')
        );
    });

    it('verifies the auth header after splitting the type of token', async () => {
        await authMiddleware(reqWithAuthHeader);

        expect(mockVerify).toHaveBeenCalledWith(actualToken);
    });

    it('returns the decoded username', async () => {
        const actual = await authMiddleware(reqWithAuthHeader);

        expect(actual).toEqual(expectedVerifierReturnValue.username);
    });

    it('calls next with error when auth header is not valid', async () => {
        mockVerify.mockRejectedValue(new Error('test error'));

        await expect(authMiddleware(reqWithAuthHeader)).rejects.toThrow(
            new APIError(403, 'not authorized')
        );
        expect(mockVerify).toHaveBeenCalledWith(actualToken);
    });

    it('calls next with error when auth header does not start with bearer', async () => {
        await expect(
            authMiddleware(reqWithIncorrectlyFormattedAuthHeader)
        ).rejects.toThrow(
            new APIError(403, 'auth credentials with invalid format')
        );
    });
});
