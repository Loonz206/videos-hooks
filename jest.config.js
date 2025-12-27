module.exports = {
  // ... other configurations ...
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // or setupTests.js
  testEnvironment: "jsdom", // ensure you're using the jsdom environment
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.ts",
  },
};
