import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import {
    testUser1,
    testUser2,
    testUser3,
    testUser4,
    UserWithToken,
} from './seedUsers';
import { createUser, authorizeUser } from 'ww-3-user-facade-tjb';
import { defaultVerifier, makeCognitoJWTAuthenticator } from 'ww-3-api-tjb';

const decode = (str: string | undefined): string =>
    str ? Buffer.from(str, 'base64').toString('binary') : 'undefined';

async function createTestUsers() {
    const testUsers = [testUser1, testUser2, testUser3, testUser4];

    const createPromises: Promise<void>[] = [];
    testUsers.forEach((u) => createPromises.push(createUser(u, true)));
    await Promise.all(createPromises);

    const authPromises: Map<
        UserWithToken,
        Promise<AuthenticationResultType>
    > = new Map();
    testUsers.forEach((u) =>
        authPromises.set(u, authorizeUser(u.username, u.password))
    );

    const it = authPromises[Symbol.iterator]();
    for (const item of it) {
        const user = item[0];
        const authPromise = item[1];
        user.token = (await authPromise).AccessToken;
        //const idToken = (await authPromise).IdToken;
        const accessToken = (await authPromise).AccessToken;
        if (accessToken) {
            const verifier = makeCognitoJWTAuthenticator(defaultVerifier);
            const decoded = await verifier('Bearer: ' + accessToken);
            console.log(`decoded is: ${decoded.toString()}`);
            // console.log(`decode.username is: ${decoded.username}`);
        }
        //         if (idToken) {
        //             const tokens = idToken.split('.');
        //             tokens.forEach((token) => {
        //                 // console.log(`token is: ${token}`);
        //                 const decoded = decode(token);
        //                 // console.log(`decoded is: ${decoded}`);
        //                 try {
        //                     const parsed = JSON.parse(decoded);
        //                     console.log(`username is: ${parsed.username}`);
        //                     // console.log(`parsed is: ${JSON.stringify(parsed)}`);
        //                 } catch (e: unknown) {
        //                     console.error(e);
        //                     console.error(`decoded is: ${decoded}`);
        //                 }
        //             });
        //         }
    }
}

module.exports = async () => {
    console.log('start global setup');

    try {
        await createTestUsers();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    console.log('end global setup');
};
