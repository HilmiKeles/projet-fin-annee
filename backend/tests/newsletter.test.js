const request = require("supertest");
const app = require("../src/app");
const { prisma } = require("@prisma/client");
const { authHeader } = require("./helpers");

describe("PATCH /api/newsletter/preference", () => {
  it("exige un token", async () => {
    const res = await request(app)
      .patch("/api/newsletter/preference")
      .send({ newsletter: true });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token manquant");
  });

  it("active la newsletter de l'utilisateur connecté", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "jean@example.com",
    });
    prisma.newsletterSubscriber.upsert.mockResolvedValue({
      email: "jean@example.com",
    });
    prisma.user.updateMany.mockResolvedValue({ count: 1 });

    const res = await request(app)
      .patch("/api/newsletter/preference")
      .set(authHeader())
      .send({ newsletter: true });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ newsletter: true });
    expect(prisma.newsletterSubscriber.upsert).toHaveBeenCalled();
  });

  it("désactive la newsletter de l'utilisateur connecté", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "jean@example.com",
    });
    prisma.newsletterSubscriber.updateMany.mockResolvedValue({ count: 1 });
    prisma.user.updateMany.mockResolvedValue({ count: 1 });

    const res = await request(app)
      .patch("/api/newsletter/preference")
      .set(authHeader())
      .send({ newsletter: false });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ newsletter: false });
  });
});
