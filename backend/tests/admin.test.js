const request = require("supertest");
const app = require("../src/app");
const { prisma } = require("@prisma/client");
const { authHeader } = require("./helpers");

describe("GET /api/admin/stats", () => {
  it("refuse un client", async () => {
    const res = await request(app)
      .get("/api/admin/stats")
      .set(authHeader({ id: "user-1", role: "CLIENT" }));

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Accès refusé");
  });

  it("agrège les statistiques pour un admin", async () => {
    prisma.ticket.count
      .mockResolvedValueOnce(100)
      .mockResolvedValueOnce(40);
    prisma.gain.findMany.mockResolvedValue([
      { user: { gender: "femme" }, lot: { name: "infuseur" } },
      { user: { gender: "homme" }, lot: { name: "detox" } },
      { user: { gender: "femme" }, lot: { name: "signature" } },
      { user: {}, lot: { name: "coffret39" } },
    ]);
    prisma.user.count.mockResolvedValue(25);

    const res = await request(app)
      .get("/api/admin/stats")
      .set(authHeader({ id: "admin-1", role: "ADMIN" }));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ticketsTotal: 100,
      ticketsUsed: 40,
      totalGains: 4,
      totalClients: 25,
      gagnantsParSexe: { femme: 2, homme: 1, inconnu: 1 },
    });
  });
});

describe("GET /api/admin/export", () => {
  it("exporte les clients pour un admin", async () => {
    const clients = [
      { email: "a@example.com", gender: "femme", birthDate: null },
    ];
    prisma.user.findMany.mockResolvedValue(clients);
    prisma.newsletterSubscriber.findMany.mockResolvedValue([]);

    const res = await request(app)
      .get("/api/admin/export")
      .set(authHeader({ id: "admin-1", role: "ADMIN" }));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      clients,
      abonnesNewsletter: [],
    });
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { role: "CLIENT" },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        newsletter: true,
        createdAt: true,
      },
    });
  });
});

describe("GET /api/admin/gain/:code", () => {
  it("autorise un employé à consulter un gain", async () => {
    const gain = {
      id: "gain-1",
      ticketCode: "ABCDEFGHIJ",
      lot: { name: "infuseur" },
      user: { email: "jean@example.com" },
    };
    prisma.gain.findUnique.mockResolvedValue(gain);

    const res = await request(app)
      .get("/api/admin/gain/ABCDEFGHIJ")
      .set(authHeader({ id: "emp-1", role: "EMPLOYEE" }));

    expect(res.status).toBe(200);
    expect(res.body).toEqual(gain);
  });

  it("renvoie 404 si aucun gain n'existe pour le ticket", async () => {
    prisma.gain.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/admin/gain/INCONNU000")
      .set(authHeader({ id: "admin-1", role: "ADMIN" }));

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Aucun gain pour ce ticket");
  });
});

describe("PATCH /api/admin/gain/:id/claim", () => {
  it("marque un gain comme remis", async () => {
    const gain = { id: "gain-1", claimed: true };
    prisma.gain.update.mockResolvedValue(gain);

    const res = await request(app)
      .patch("/api/admin/gain/gain-1/claim")
      .set(authHeader({ id: "emp-1", role: "EMPLOYEE" }));

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Gain marqué comme remis");
    expect(res.body.gain).toEqual(gain);
    expect(prisma.gain.update).toHaveBeenCalledWith({
      where: { id: "gain-1" },
      data: { claimed: true },
    });
  });
});
