const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/.corepack'],
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
}

module.exports = createJestConfig(config)
