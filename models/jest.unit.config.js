module.exports = {
    transform: { '^.+\\.ts?$': 'ts-jest' },
    testEnvironment: 'node',
    testRegex: '/test/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: [
        'node_modules',
        '<rootDir>/src/app.ts',
        '<rootDir>/src/index.ts',
        '<rootDir>/src/clients/picture_cache_service.ts',
    ],
};
