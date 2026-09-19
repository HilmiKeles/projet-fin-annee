const request = require("supertest");
const app = require("../src/app");

describe("routes utilitaires", () => {
  it("répond OK sur /api/health", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("interdit l'indexation via /robots.txt", async () => {
    const res = await request(app).get("/robots.txt");

    expect(res.status).toBe(200);
    expect(res.text).toContain("Disallow: /");
  });

  it("expose les métriques Prometheus", async () => {
    const res = await request(app).get("/metrics");

    expect(res.status).toBe(200);
    expect(res.text).toContain("http_requests_total");
  });
});
