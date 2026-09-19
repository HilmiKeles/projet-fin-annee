const request = require("supertest");
const app = require("../src/app");
const { prisma } = require("@prisma/client");
const { authHeader } = require("./helpers");

describe("POST /api/tickets/validate", () => {
  it("exige un token", async () => {
    const res = await request(app)
      .post("/api/tickets/validate")
      .send({ code: "ABCDEFGHIJ" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token manquant");
  });

  it("refuse un ticket inconnu", async () => {
    prisma.ticket.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/tickets/validate")
      .set(authHeader())
      .send({ code: "INCONNU000" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Ticket invalide");
  });

  it("refuse un ticket déjà utilisé", async () => {
    prisma.ticket.findFirst.mockResolvedValue({
      id: "ticket-1",
      code: "ABCDEFGHIJ",
      used: true,
    });

    const res = await request(app)
      .post("/api/tickets/validate")
      .set(authHeader())
      .send({ code: "ABCDEFGHIJ" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Ticket déjà utilisé");
  });

  it("renvoie une erreur s'il n'y a plus de lots", async () => {
    prisma.ticket.findFirst.mockResolvedValue({
      id: "ticket-1",
      code: "ABCDEFGHIJ",
      used: false,
    });
    prisma.lot.findMany.mockResolvedValue([]);

    const res = await request(app)
      .post("/api/tickets/validate")
      .set(authHeader())
      .send({ code: "ABCDEFGHIJ" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Plus de lots disponibles");
  });

  it("enregistre le gain et marque le ticket comme utilisé", async () => {
    prisma.ticket.findFirst.mockResolvedValue({
      id: "ticket-1",
      code: "ABCDEFGHIJ",
      used: false,
    });
    prisma.lot.findMany.mockResolvedValue([
      { id: "lot-infuseur", name: "infuseur", stock: 10 },
    ]);
    prisma.gain.create.mockResolvedValue({
      lot: { name: "infuseur" },
    });
    prisma.ticket.update.mockResolvedValue({ used: true });
    prisma.lot.update.mockResolvedValue({ stock: 9 });
    jest.spyOn(Math, "random").mockReturnValue(0);

    const res = await request(app)
      .post("/api/tickets/validate")
      .set(authHeader({ id: "user-1", role: "CLIENT" }))
      .send({ code: "ABCDEFGHIJ" });

    Math.random.mockRestore();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Félicitations !",
      gain: "infuseur",
    });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.gain.create).toHaveBeenCalledWith({
      data: { userId: "user-1", ticketCode: "ABCDEFGHIJ", lotId: "lot-infuseur" },
      include: { lot: true },
    });
  });
});

describe("GET /api/tickets/my-gains", () => {
  it("retourne les gains de l'utilisateur connecté", async () => {
    const gains = [
      { id: "gain-1", ticketCode: "ABCDEFGHIJ", lot: { name: "infuseur" } },
    ];
    prisma.gain.findMany.mockResolvedValue(gains);

    const res = await request(app)
      .get("/api/tickets/my-gains")
      .set(authHeader({ id: "user-1", role: "CLIENT" }));

    expect(res.status).toBe(200);
    expect(res.body).toEqual(gains);
    expect(prisma.gain.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      include: { lot: true },
    });
  });
});
