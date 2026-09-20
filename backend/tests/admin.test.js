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

describe("GET /api/admin/gains", () => {
  it("refuse un client", async () => {
    const res = await request(app)
      .get("/api/admin/gains")
      .set(authHeader({ id: "user-1", role: "CLIENT" }));

    expect(res.status).toBe(403);
    expect(prisma.gain.findMany).not.toHaveBeenCalled();
  });

  it("liste les gagnants pour un employé", async () => {
    prisma.gain.findMany.mockResolvedValue([
      {
        id: "gain-1",
        ticketCode: "ABCDEFGHIJ",
        claimed: false,
        wonAt: "2026-03-15T10:00:00.000Z",
        lot: { name: "infuseur" },
        user: {
          firstName: "Marie",
          lastName: "Martin",
          email: "marie@example.com",
        },
      },
    ]);

    const res = await request(app)
      .get("/api/admin/gains")
      .set(authHeader({ id: "emp-1", role: "EMPLOYEE" }));

    expect(res.status).toBe(200);
    expect(res.body.gains).toEqual([
      {
        id: "gain-1",
        prize: "infuseur",
        code: "ABCDEFGHIJ",
        claimed: false,
        wonAt: "2026-03-15T10:00:00.000Z",
        firstName: "Marie",
        lastName: "Martin",
        email: "marie@example.com",
      },
    ]);
    expect(prisma.gain.findMany).toHaveBeenCalledWith({
      include: {
        lot: { select: { name: true } },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { wonAt: "desc" },
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

describe("GET /api/admin/employes", () => {
  it("refuse un employé", async () => {
    const res = await request(app)
      .get("/api/admin/employes")
      .set(authHeader({ id: "emp-1", role: "EMPLOYEE" }));

    expect(res.status).toBe(403);
  });

  it("liste les employés pour un admin", async () => {
    const employes = [
      {
        id: "emp-1",
        email: "employe@example.com",
        firstName: "Employe",
        lastName: "Boutique",
        createdAt: "2026-09-20T00:00:00.000Z",
      },
    ];
    prisma.user.findMany.mockResolvedValue(employes);

    const res = await request(app)
      .get("/api/admin/employes")
      .set(authHeader({ id: "admin-1", role: "ADMIN" }));

    expect(res.status).toBe(200);
    expect(res.body.employes).toEqual(employes);
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { role: "EMPLOYEE" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  });
});

describe("POST /api/admin/employes", () => {
  it("refuse un client", async () => {
    const res = await request(app)
      .post("/api/admin/employes")
      .set(authHeader({ id: "user-1", role: "CLIENT" }))
      .send({ email: "employe@example.com", password: "MotDePasse1!" });

    expect(res.status).toBe(403);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("refuse un e-mail invalide", async () => {
    const res = await request(app)
      .post("/api/admin/employes")
      .set(authHeader({ id: "admin-1", role: "ADMIN" }))
      .send({ email: "pas-un-email", password: "MotDePasse1!" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/e-mail/i);
  });

  it("refuse un mot de passe trop faible", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/admin/employes")
      .set(authHeader({ id: "admin-1", role: "ADMIN" }))
      .send({ email: "employe@example.com", password: "faible" });

    expect(res.status).toBe(400);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("refuse de transformer un administrateur", async () => {
    prisma.user.findUnique.mockResolvedValue({
      email: "admin@thetiptop.fr",
      role: "ADMIN",
    });

    const res = await request(app)
      .post("/api/admin/employes")
      .set(authHeader({ id: "admin-1", role: "ADMIN" }))
      .send({ email: "admin@thetiptop.fr", password: "MotDePasse1!" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/administrateur/i);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("crée un nouvel employé", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: "emp-1",
      email: "employe@example.com",
      firstName: "Employe",
      lastName: "Boutique",
      createdAt: "2026-09-20T00:00:00.000Z",
      role: "EMPLOYEE",
    });

    const res = await request(app)
      .post("/api/admin/employes")
      .set(authHeader({ id: "admin-1", role: "ADMIN" }))
      .send({ email: "employe@example.com", password: "MotDePasse1!" });

    expect(res.status).toBe(201);
    expect(res.body.cree).toBe(true);
    expect(res.body.employe.email).toBe("employe@example.com");
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: "employe@example.com",
        role: "EMPLOYEE",
        firstName: "Employe",
        lastName: "Boutique",
      }),
    });
  });

  it("promeut un client existant sans changer son mot de passe", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "marie@example.com",
      role: "CLIENT",
    });
    prisma.user.update.mockResolvedValue({
      id: "u1",
      email: "marie@example.com",
      firstName: "Marie",
      lastName: "Martin",
      createdAt: "2026-01-01T00:00:00.000Z",
      role: "EMPLOYEE",
    });

    const res = await request(app)
      .post("/api/admin/employes")
      .set(authHeader({ id: "admin-1", role: "ADMIN" }))
      .send({ email: "marie@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.cree).toBe(false);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: "marie@example.com" },
      data: { role: "EMPLOYEE" },
    });
  });
});

describe("POST /api/admin/tickets", () => {
  it("refuse un client", async () => {
    const res = await request(app)
      .post("/api/admin/tickets")
      .set(authHeader({ id: "user-1", role: "CLIENT" }))
      .send({ quantite: 1 });

    expect(res.status).toBe(403);
    expect(prisma.ticket.create).not.toHaveBeenCalled();
  });

  it("refuse une quantité invalide", async () => {
    const res = await request(app)
      .post("/api/admin/tickets")
      .set(authHeader({ id: "admin-1", role: "ADMIN" }))
      .send({ quantite: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/1 et 20/);
  });

  it("crée des codes pour un admin", async () => {
    prisma.lot.findFirst.mockResolvedValue({ id: "lot-1", name: "infuseur", stock: 10 });
    prisma.ticket.create
      .mockResolvedValueOnce({ code: "ABCDEFGHIJ", used: false })
      .mockResolvedValueOnce({ code: "KLMNOPQRST", used: false });

    const res = await request(app)
      .post("/api/admin/tickets")
      .set(authHeader({ id: "admin-1", role: "ADMIN" }))
      .send({ quantite: 2 });

    expect(res.status).toBe(201);
    expect(res.body.codes).toEqual(["ABCDEFGHIJ", "KLMNOPQRST"]);
    expect(prisma.ticket.create).toHaveBeenCalledTimes(2);
  });
});
