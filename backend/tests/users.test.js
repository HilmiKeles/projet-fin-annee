const request = require("supertest");
const app = require("../src/app");
const { prisma } = require("@prisma/client");
const { authHeader } = require("./helpers");

describe("GET /api/users/me", () => {
  it("exige un token", async () => {
    const res = await request(app).get("/api/users/me");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token manquant");
  });

  it("renvoie 404 si l'utilisateur n'existe plus", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/users/me")
      .set(authHeader({ id: "user-inconnu", role: "CLIENT" }));

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Utilisateur non trouvé");
  });

  it("retourne le profil sans mot de passe et les participations", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "jean@example.com",
      password: "hash-secret",
      firstName: "Jean",
      lastName: "Dupont",
      role: "CLIENT",
    });
    prisma.gain.findMany.mockResolvedValue([
      {
        id: "gain-1",
        ticketCode: "ABCDEFGHIJ",
        claimed: false,
        wonAt: "2026-09-01T10:00:00.000Z",
        lot: { name: "infuseur" },
      },
    ]);

    const res = await request(app)
      .get("/api/users/me")
      .set(authHeader({ id: "user-1", role: "CLIENT" }));

    expect(res.status).toBe(200);
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.user.firstName).toBe("Jean");
    expect(res.body.user.lastName).toBe("Dupont");
    expect(res.body.participations).toEqual([
      {
        id: "gain-1",
        prize: "infuseur",
        code: "ABCDEFGHIJ",
        claimed: false,
        playedAt: "2026-09-01T10:00:00.000Z",
      },
    ]);
  });

  it("utilise des prénoms par défaut si les champs sont vides", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "jean@example.com",
      password: "hash-secret",
    });
    prisma.gain.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get("/api/users/me")
      .set(authHeader({ id: "user-1", role: "CLIENT" }));

    expect(res.status).toBe(200);
    expect(res.body.user.firstName).toBe("Cher");
    expect(res.body.user.lastName).toBe("Client");
    expect(res.body.participations).toEqual([]);
  });
});
