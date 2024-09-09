import { get_app_config } from 'dwf-3-app-config-tjb';
import { mongoClientFactory } from './mongo_factory';
import { seedSettings } from './seedSettings';
import { testUser1, testUser2, testUser3 } from './seedUsers';
import { authUser, createUser } from '../api_helpers/user_api';

// Create the database
async function createTestDatabase() {
    // connecting to a table and collection will make them if they don't already exist
    await mongoClientFactory();
}

// Seed the database with schema and data
async function seedTestDatabase() {
    const mongoClient = await mongoClientFactory();
    await mongoClient
        .db(get_app_config().updateToolSettingsDbConnectionConfig.db)
        .collection(
            get_app_config().updateToolSettingsDbConnectionConfig.collection
        )
        .insertMany(seedSettings);
}

async function createTestUsers() {
    const testUsers = [testUser1, testUser2, testUser3];

    const createPromises: Promise<void>[] = [];
    testUsers.forEach((u) => createPromises.push(createUser(u)));
    await Promise.all(createPromises);

    const authPromises: Promise<void>[] = [];
    testUsers.forEach((u) => authPromises.push(authUser(u)));
    await Promise.all(authPromises);
}

module.exports = async () => {
    console.log('start global setup');

    try {
        await createTestDatabase();
        await seedTestDatabase();
        await createTestUsers();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    console.log('end global setup');
};

// ////////////////////////////////////////////////////////////////////////////
//
// TODO - Why am I repeating myself so much with the fetch stuff???????????????
//
// ////////////////////////////////////////////////////////////////////////////
