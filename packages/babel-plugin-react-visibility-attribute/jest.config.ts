import type { Config } from 'jest';

const config: Config = {
  // moduleFileExtensions: ['ts', 'js'],
  // globals: {
  //   'ts-jest': {
  //     tsconfig: '<rootDir>/tsconfig.json',
  //   },
  // },

  testMatch: ['**/__tests__/plugin.test.js'],
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
};

export default config;
