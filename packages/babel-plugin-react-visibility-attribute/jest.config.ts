import type { Config } from 'jest';

const config: Config = {
  // preset: 'ts-jest',
  // testEnvironment: 'node',
  // testMatch: ['**/__tests__/plugin.test.js'],
  // roots: ['<rootDir>'],
  // moduleFileExtensions: ['ts', 'js'],
  // globals: {
  //   'ts-jest': {
  //     tsconfig: '<rootDir>/tsconfig.json',
  //   },
  // },

  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8', // или 'babel' если используешь Babel
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
};

export default config;
