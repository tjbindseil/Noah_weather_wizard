import {
    CognitoJwtVerifierSingleUserPool,
    CognitoJwtVerifier,
} from 'aws-jwt-verify/cognito-verifier';
import { APIError } from './api_error';

export type JWTAuthenticator = (s: string | undefined) => Promise<string>;

type CognitoJwtVerifierReturn = CognitoJwtVerifierSingleUserPool<{
    userPoolId: string;
    tokenUse: 'access';
    clientId: string;
}>;

const clientId = '710a0udc55uijq37av84ldipph';
export const defaultVerifier = CognitoJwtVerifier.create({
    userPoolId: 'us-east-1_mDsHOM6wS',
    tokenUse: 'access',
    clientId: clientId,
});

export const makeCognitoJWTAuthenticator = (
    cognitoVerifier: CognitoJwtVerifierReturn
) => {
    return async (authHeader: string | undefined) => {
        if (!authHeader) {
            throw new APIError(401, 'no auth credentials provided');
        } else {
            const reqHeaderTokens = authHeader.split(' ');
            if (
                reqHeaderTokens.length === 2 &&
                reqHeaderTokens[0] === 'Bearer:'
            ) {
                try {
                    const decoded = await cognitoVerifier.verify(
                        reqHeaderTokens[1]
                    );
                    return decoded.username;
                } catch (e: unknown) {
                    console.error(`jwtAuthenticator error is: ${e}`);
                    throw new APIError(403, 'not authorized');
                }
            } else {
                throw new APIError(401, 'auth credentials with invalid format');
            }
        }
    };
};
