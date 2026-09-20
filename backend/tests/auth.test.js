const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../src/services/googleAuth");

const { verifierCredentialGoogle } = require("../src/services/googleAuth");
const app = require("../src/app");
const { prisma } = require("@prisma/client");

describe("POST /api/auth/register", () => {
  it("refuse un mot de passe trop faible", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "jean@example.com",
      password: "faible",
      firstName: "Jean",
      lastName: "Dupont",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/mot de passe/i);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("crée un utilisateur et masque le mot de passe dans la réponse", async () => {
    prisma.user.create.mockResolvedValue({
      id: "user-1",
      email: "jean@example.com",
      password: "hash",
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "jean@example.com",
      password: "Password1!",
      firstName: "Jean",
      lastName: "Dupont",
      newsletter: true,
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "user-1", email: "jean@example.com" });
    expect(prisma.user.create).toHaveBeenCalledTimes(1);

    const data = prisma.user.create.mock.calls[0][0].data;
    expect(data.email).toBe("jean@example.com");
    expect(data.firstName).toBe("Jean");
    expect(data.newsletter).toBe(true);
    expect(data.password).not.toBe("Password1!");
    expect(await bcrypt.compare("Password1!", data.password)).toBe(true);
    expect(prisma.newsletterSubscriber.upsert).toHaveBeenCalled();
  });

  it("refuse une adresse e-mail invalide", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "pas-un-email",
      password: "Password1!",
      firstName: "Jean",
      lastName: "Dupont",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/e-mail/i);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("renvoie une erreur si l'email existe déjà", async () => {
    const conflit = new Error("Unique constraint");
    conflit.code = "P2002";
    prisma.user.create.mockRejectedValue(conflit);

    const res = await request(app).post("/api/auth/register").send({
      email: "jean@example.com",
      password: "Password1!",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email déjà utilisé");
  });
});

describe("POST /api/auth/login", () => {
  it("refuse des identifiants inconnus", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      email: "inconnu@example.com",
      password: "Password1!",
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Identifiants invalides");
  });

  it("refuse un mot de passe incorrect", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "jean@example.com",
      password: await bcrypt.hash("Password1!", 10),
      role: "CLIENT",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "jean@example.com",
      password: "WrongPass1!",
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Identifiants invalides");
  });

  it("renvoie un JWT et le rôle en cas de succès", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "jean@example.com",
      password: await bcrypt.hash("Password1!", 10),
      role: "CLIENT",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "jean@example.com",
      password: "Password1!",
    });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe("CLIENT");
    expect(typeof res.body.token).toBe("string");

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.id).toBe("user-1");
    expect(decoded.role).toBe("CLIENT");
  });
});

describe("POST /api/auth/google", () => {
  const profilGoogle = {
    email: "jean.google@example.com",
    firstName: "Jean",
    lastName: "Dupont",
  };

  it("refuse un jeton Google rejeté", async () => {
    const erreur = new Error("Jeton Google invalide.");
    erreur.status = 401;
    verifierCredentialGoogle.mockRejectedValue(erreur);

    const res = await request(app)
      .post("/api/auth/google")
      .send({ credential: "mauvais-jeton" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Jeton Google invalide.");
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("crée un compte puis renvoie un JWT", async () => {
    verifierCredentialGoogle.mockResolvedValue(profilGoogle);
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: "user-google",
      email: profilGoogle.email,
      firstName: "Jean",
      lastName: "Dupont",
      role: "CLIENT",
    });

    const res = await request(app)
      .post("/api/auth/google")
      .send({ credential: "google-jwt" });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("jean.google@example.com");
    expect(typeof res.body.token).toBe("string");
    expect(prisma.user.create).toHaveBeenCalledTimes(1);

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.id).toBe("user-google");
  });

  it("connecte un utilisateur déjà existant sans le recréer", async () => {
    verifierCredentialGoogle.mockResolvedValue(profilGoogle);
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: profilGoogle.email,
      firstName: "Jean",
      lastName: "Dupont",
      role: "CLIENT",
    });

    const res = await request(app)
      .post("/api/auth/google")
      .send({ credential: "google-jwt" });

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe("user-1");
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});
