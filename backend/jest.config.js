module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Cette ligne permet de trouver les fichiers de test
    testMatch: ['**/_tests_/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
    setupFiles: ['dotenv/config']
  };