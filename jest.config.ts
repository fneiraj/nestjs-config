import type { Config } from "@jest/types";

export default {
  preset: "ts-jest",
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/lib/**/*.ts"],
  coverageReporters: ["json", "lcov", "text", "clover"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "lib/index.ts",
    "lib/__config/",
  ],
  reporters: ["default"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  errorOnDeprecated: true,
} as Config.InitialOptions;
