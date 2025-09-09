module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.(spec|integration\\.spec)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/test/global-setup.ts',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  preset: 'ts-jest'
}