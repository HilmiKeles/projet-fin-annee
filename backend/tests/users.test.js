const request = require("supertest");
const bcrypt = require("bcryptjs");
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
    expect(res.body.gains).toEqual(res.body.participations);
    expect(res.body.resume).toEqual({
      total: 1,
      aRetirer: 1,
      remis: 0,
    });
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
    expect(res.body.resume).toEqual({ total: 0, aRetirer: 0, remis: 0 });
  });
});

describe("PATCH /api/users/me/password", () => {
  it("exige un token", async () => {
    const res = await request(app).patch("/api/users/me/password").send({
      currentPassword: "Password1!",
      newPassword: "NewPass1!",
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token manquant");
  });

  it("refuse un nouveau mot de passe trop faible", async () => {
    const res = await request(app)
      .patch("/api/users/me/password")
      .set(authHeader())
      .send({ currentPassword: "Password1!", newPassword: "faible" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/mot de passe/i);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("refuse si le mot de passe actuel est incorrect", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      password: await bcrypt.hash("Password1!", 10),
    });

    const res = await request(app)
      .patch("/api/users/me/password")
      .set(authHeader())
      .send({ currentPassword: "WrongPass1!", newPassword: "NewPass1!" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Mot de passe actuel incorrect.");
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("met à jour le mot de passe", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      password: await bcrypt.hash("Password1!", 10),
    });
    prisma.user.update.mockResolvedValue({ id: "user-1" });

    const res = await request(app)
      .patch("/api/users/me/password")
      .set(authHeader({ id: "user-1", role: "CLIENT" }))
      .send({ currentPassword: "Password1!", newPassword: "NewPass1!" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Mot de passe mis à jour.");
    expect(prisma.user.update).toHaveBeenCalledTimes(1);

    const hashed = prisma.user.update.mock.calls[0][0].data.password;
    expect(hashed).not.toBe("NewPass1!");
    expect(await bcrypt.compare("NewPass1!", hashed)).toBe(true);
  });
});

describe("DELETE /api/users/me", () => {
  it("exige un token", async () => {
    const res = await request(app).delete("/api/users/me").send({
      password: "Password1!",
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Token manquant");
  });

  it("refuse de supprimer un compte administrateur", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "admin-1",
      role: "ADMIN",
      password: await bcrypt.hash("Admin123!", 10),
    });

    const res = await request(app)
      .delete("/api/users/me")
      .set(authHeader({ id: "admin-1", role: "ADMIN" }))
      .send({ password: "Admin123!" });

    expect(res.status).toBe(403);
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it("refuse si le mot de passe est incorrect", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      role: "CLIENT",
      password: await bcrypt.hash("Password1!", 10),
    });

    const res = await request(app)
      .delete("/api/users/me")
      .set(authHeader())
      .send({ password: "WrongPass1!" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Mot de passe incorrect.");
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it("supprime les gains puis le compte", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      role: "CLIENT",
      password: await bcrypt.hash("Password1!", 10),
    });
    prisma.gain.deleteMany.mockResolvedValue({ count: 2 });
    prisma.user.delete.mockResolvedValue({ id: "user-1" });

    const res = await request(app)
      .delete("/api/users/me")
      .set(authHeader({ id: "user-1", role: "CLIENT" }))
      .send({ password: "Password1!" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Compte supprimé.");
    expect(prisma.gain.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
    });
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: "user-1" },
    });
  });
});
