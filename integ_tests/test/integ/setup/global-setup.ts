import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import { testUser1, testUser2, testUser3, UserWithToken } from './seedUsers';
import { createUser, authorizeUser } from 'ww-3-user-facade-tjb';

async function createTestUsers() {
    const testUsers = [testUser1, testUser2, testUser3];

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
