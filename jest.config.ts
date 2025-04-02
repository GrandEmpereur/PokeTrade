import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  collectCoverage: true,
  coverageReporters: ["html"],
  testEnvironment: 'jsdom',
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/test/**",
    "!src/types/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Transformer configuration pour les modules ES
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.test.js' }],
  },

  // Ne pas ignorer les node_modules pour chai et d'autres packages utilisant ES modules
  transformIgnorePatterns: [
    "/node_modules/(?!(chai|@remix-run|@sindresorhus)).+\\.js$"
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)