module.exports = async () => {
    console.log('start global setup');

    try {
        //         await createTestDatabase();
        //         await seedTestDatabase();
        //         await createTestUsers();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    console.log('end global setup');
};
