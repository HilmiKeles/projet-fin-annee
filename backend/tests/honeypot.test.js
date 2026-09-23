const request = require("supertest");
const app = require("../src/app");
const { prisma } = require("@prisma/client");
const { estCoche } = require("../src/middleware/honeypot");

describe("Piège anti-robot (honeypot)", () => {
  it("refuse une inscription dont la case invisible est cochée", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "robot@example.com",
      password: "Password1!",
      firstName: "Ro",
      lastName: "Bot",
      confirmationHumaine: true,
    });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Accès refusé.");
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("refuse une connexion dont la case invisible est cochée", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "jean@example.com",
      password: "Password1!",
      confirmationHumaine: "on",
    });

    expect(res.status).toBe(403);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("refuse une inscription newsletter dont la case invisible est cochée", async () => {
    const res = await request(app).post("/api/newsletter/subscribe").send({
      email: "robot@example.com",
      consent: true,
      confirmation_humaine: true,
    });

    expect(res.status).toBe(403);
    expect(prisma.newsletterSubscriber.upsert).not.toHaveBeenCalled();
  });

  it("laisse passer une requête dont la case invisible reste décochée", async () => {
    prisma.newsletterSubscriber.upsert.mockResolvedValue({
      email: "jean@example.com",
    });
    prisma.user.updateMany.mockResolvedValue({ count: 1 });

    const res = await request(app).post("/api/newsletter/subscribe").send({
      email: "jean@example.com",
      consent: true,
      confirmationHumaine: false,
    });

    expect(res.status).toBe(200);
  });

  it("laisse passer une requête sans le champ piège", async () => {
    prisma.newsletterSubscriber.upsert.mockResolvedValue({
      email: "marie@example.com",
    });
    prisma.user.updateMany.mockResolvedValue({ count: 1 });

    const res = await request(app)
      .post("/api/newsletter/subscribe")
      .send({ email: "marie@example.com", consent: true });

    expect(res.status).toBe(200);
  });

  describe("estCoche", () => {
    it.each([true, 1, "true", "on", "1", "OUI", " yes "])(
      "considère %p comme coché",
      (valeur) => {
        expect(estCoche(valeur)).toBe(true);
      },
    );

    it.each([false, 0, "", "false", "off", null, undefined, {}])(
      "considère %p comme décoché",
      (valeur) => {
        expect(estCoche(valeur)).toBe(false);
      },
    );
  });
});
