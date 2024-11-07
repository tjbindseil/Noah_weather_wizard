import { User } from 'ww-3-models-tjb';
import {
    AuthFlowType,
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    DeleteUserCommand,
    InitiateAuthCommand,
    ResendConfirmationCodeCommand,
    SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIError } from 'ww-3-api-tjb';

const clientId = '6j6t301u6iu773ic3dc627fi0n';
const client = new CognitoIdentityProviderClient({});

export const createUser = async (user: User, testUser = false) => {
    const command = new SignUpCommand({
        ClientId: clientId,
        Username: user.username,
        Password: user.password,
        UserAttributes: [
            {
                Name: 'email',
                Value: user.email,
            },
        ],
        ClientMetadata: {
            testUser: testUser ? 'true' : 'false',
        },
    });

    // TODO make sure its clear in UI that usernames are case insensitive
    // that is happening automatically when we send to cognito and is
    // intentional because email addresses are case insensitive. This way,
    // I can change to having an email be the username, or at the least,
    // its allowed
    //
    // or, since an email or phone must be used (and is tracked differently),
    // maybe usename should actually be case sensitive.
    //
    // this way, I don't have to deal with this problem

    // TODO handle UsernameExistsException
    //         if (err instanceof JwtExpiredError) {
    //             console.error('JWT expired!');
    //         }
    const response = await client.send(command);
    // response.UserConfirmed;
    // TODO what if an unconfirmed user attempts to sign in?
    // TODO what if an unconfirmed user attempts to make a new account (UsernameExistsException for this case)

    return response;
};

export const authorizeUser = async (username: string, password: string) => {
    const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
        ClientId: clientId,
    });

    const result = await client.send(command);

    if (!result.AuthenticationResult) {
        console.error(
            `PostAuth: undefined AuthenticationResult, result is: ${JSON.stringify(
                result
            )}`
        );
        throw new APIError(401, 'issue authenticating');
    }

    return result.AuthenticationResult;
};

export const confirmUser = async (
    username: string,
    confirmationCode: string
) => {
    const command = new ConfirmSignUpCommand({
        ClientId: clientId,
        Username: username,
        ConfirmationCode: confirmationCode,
    });
    await client.send(command);
};

export const refreshUser = async (refreshToken: string) => {
    const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
        AuthParameters: {
            REFRESH_TOKEN: refreshToken,
        },
        ClientId: clientId,
    });

    const result = await client.send(command);

    if (!result.AuthenticationResult) {
        console.error(
            `PostRefresh: undefined AuthenticationResult, result is: ${JSON.stringify(
                result
            )}`
        );
        throw new APIError(401, 'issue authenticating');
    }

    return result.AuthenticationResult;
};

export const deleteUser = async (token: string) => {
    const deleteCommand = new DeleteUserCommand({
        AccessToken: token,
    });

    await client.send(deleteCommand);
};

export const getNewRefreshCode = async (username: string) => {
    const newRefreshCodeCommand = new ResendConfirmationCodeCommand({
        ClientId: clientId,
        Username: username,
    });

    await client.send(newRefreshCodeCommand);
};
