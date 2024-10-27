import {
    testUser1,
    testUser2,
    testUser3,
    testUser4,
    UserWithTokens,
} from './seedUsers';
import { postAuth, postUser } from '../api_helpers/user_service_api';
import { PostAuthOutput, PostUserOutput } from 'ww-3-models-tjb';

async function createTestUsers() {
    const testUsers = [testUser1, testUser2, testUser3, testUser4];

    const createPromises: Promise<PostUserOutput>[] = [];
    testUsers.forEach((u) =>
        createPromises.push(postUser({ user: u, testUser: true }))
    );
    await Promise.all(createPromises);

    const authPromises: Map<
        UserWithTokens,
        Promise<PostAuthOutput>
    > = new Map();
    testUsers.forEach((u) =>
        authPromises.set(
            u,
            postAuth({ username: u.username, password: u.password })
        )
    );

    const it = authPromises[Symbol.iterator]();
    for (const item of it) {
        const user = item[0];
        const authPromise = item[1];
        user.accessToken = (await authPromise).accessToken;
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
