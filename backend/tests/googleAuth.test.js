const { OAuth2Client } = require("google-auth-library");
const { verifierCredentialGoogle } = require("../src/services/googleAuth");

jest.mock("google-auth-library");

describe("verifierCredentialGoogle", () => {
  const originalClientId = process.env.GOOGLE_CLIENT_ID;

  afterEach(() => {
    process.env.GOOGLE_CLIENT_ID = originalClientId;
  });

  it("refuse un jeton absent", async () => {
    await expect(verifierCredentialGoogle()).rejects.toMatchObject({
      message: "Jeton Google manquant.",
      status: 400,
    });
  });

  it("refuse si GOOGLE_CLIENT_ID n'est pas configuré", async () => {
    delete process.env.GOOGLE_CLIENT_ID;
    await expect(verifierCredentialGoogle("jeton")).rejects.toMatchObject({
      message: "Connexion Google non configurée.",
      status: 503,
    });
  });

  it("refuse un compte Google non vérifié", async () => {
    process.env.GOOGLE_CLIENT_ID = "client-test";
    OAuth2Client.mockImplementation(() => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        getPayload: () => ({
          email: "jean@example.com",
          email_verified: false,
        }),
      }),
    }));

    await expect(verifierCredentialGoogle("jeton")).rejects.toMatchObject({
      status: 401,
      message: "Compte Google non vérifié.",
    });
  });

  it("renvoie l'email et le nom si le jeton est valide", async () => {
    process.env.GOOGLE_CLIENT_ID = "client-test";
    OAuth2Client.mockImplementation(() => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        getPayload: () => ({
          email: "Jean.Google@example.com",
          email_verified: true,
          given_name: "Jean",
          family_name: "Dupont",
        }),
      }),
    }));

    await expect(verifierCredentialGoogle("jeton-valide")).resolves.toEqual({
      email: "jean.google@example.com",
      firstName: "Jean",
      lastName: "Dupont",
    });
  });
});
