module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Cette ligne permet de trouver les fichiers de test
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  setupFiles: ['dotenv/config']
};