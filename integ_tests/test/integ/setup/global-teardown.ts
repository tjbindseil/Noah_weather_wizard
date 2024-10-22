import { testUser1, testUser2, testUser3 } from './seedUsers';
import { deleteUser } from 'ww-3-user-facade-tjb';

const deleteTestUsers = async () => {
    const deletePromises: Promise<void>[] = [];
    [testUser1, testUser2, testUser3].forEach((u) => {
        if (!u.token) {
            console.error(
                `user: ${JSON.stringify(
                    u
                )} does not have a token during teardown`
            );
            throw new Error();
        }
        deletePromises.push(deleteUser(u.token));
    });
    await Promise.all(deletePromises);
};

module.exports = async () => {
    console.log('start global teardown');
    await deleteTestUsers();
    console.log('end global teardown');
};
