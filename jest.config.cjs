module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.(ts|tsx)$': 'babel-jest' },
  moduleNameMapper: { '\\.(css|less|scss)$': '<rootDir>/src/tests/styleMock.cjs' },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  testMatch: ['<rootDir>/src/**/*.test.(ts|tsx)']
};
