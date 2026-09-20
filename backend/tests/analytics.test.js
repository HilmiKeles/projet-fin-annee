const request = require("supertest");
const app = require("../src/app");
const { prisma } = require("@prisma/client");

describe("POST /api/analytics/cta", () => {
  it("refuse un CTA inconnu", async () => {
    const res = await request(app)
      .post("/api/analytics/cta")
      .send({ name: "inconnu" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/cta/i);
    expect(prisma.ctaClick.create).not.toHaveBeenCalled();
  });

  it("enregistre un clic autorisé", async () => {
    prisma.ctaClick.create.mockResolvedValue({
      id: "cta-1",
      name: "je-participe",
    });

    const res = await request(app)
      .post("/api/analytics/cta")
      .send({ name: "je-participe" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true });
    expect(prisma.ctaClick.create).toHaveBeenCalledWith({
      data: { name: "je-participe" },
    });
  });
});
