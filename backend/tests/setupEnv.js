process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-the-tip-top";

jest.mock("../src/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  on: jest.fn(),
}));

jest.mock("@prisma/client");
