import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  rootDir: '.',
  testRegex: '.e2e-spec.ts$',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/../src/$1',
    '^@modules(.*)$': '<rootDir>/../src/modules/$1',
    '^@config(.*)$': '<rootDir>/../src/infrastructure/configs/$1',
    '^@core(.*)$': '<rootDir>/../src/core/$1',
  },
};
export default config;
