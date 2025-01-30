/** @type {import('ts-jest').JestConfigWithTsJest} **/
// module.exports = {
//   testEnvironment: "node",
//   transform: {
//     "^.+.tsx?$": ["ts-jest",{}],
//   },
// };

module.exports = {
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.tsx'], // Matches all `.test.tsx` files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@utilities/(.*)$': '<rootDir>/components/Utilities/$1', // Map @utilities/ to components/Utilities/
    '^@components/(.*)$': '<rootDir>/components/$1', // If you have other aliases like @components/
  },
};
