import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  rootDir: 'src',
  testRegex: '.spec.ts$',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/$1',
    '^@modules(.*)$': '<rootDir>/modules/$1',
    '^@config(.*)$': '<rootDir>/infrastructure/configs/$1',
    '^@core(.*)$': '<rootDir>/core/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
};
export default config;
