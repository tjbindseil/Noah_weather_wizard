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
        '<rootDir>/src/handlers/index.ts',
        '<rootDir>/src/db/index.ts',
    ],
    moduleNameMapper: {
        '#node-web-compat': './node-web-compat-node.js',
    },
};
