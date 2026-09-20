const reporters = ["default"];

try {
  require.resolve("jest-junit");
  reporters.push(["jest-junit", { outputName: "junit.xml" }]);
} catch {
  // Reporter Jenkins optionnel si le paquet n'est pas encore installé en local
}

module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFiles: ["<rootDir>/tests/setupEnv.js"],
  clearMocks: true,
  forceExit: true,
  reporters,
};
