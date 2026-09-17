const jwt = require("jsonwebtoken");
const { authMiddleware, requireRole } = require("../src/middleware/auth");

function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("authMiddleware", () => {
  it("refuse une requête sans token", () => {
    const req = { headers: {} };
    const res = mockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token manquant" });
    expect(next).not.toHaveBeenCalled();
  });

  it("refuse un token invalide", () => {
    const req = { headers: { authorization: "Bearer token-invalide" } };
    const res = mockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token invalide" });
    expect(next).not.toHaveBeenCalled();
  });

  it("attache l'utilisateur et continue si le token est valide", () => {
    const token = jwt.sign(
      { id: "user-1", role: "CLIENT" },
      process.env.JWT_SECRET,
    );
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(req.user.id).toBe("user-1");
    expect(req.user.role).toBe("CLIENT");
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("requireRole", () => {
  it("refuse un rôle non autorisé", () => {
    const req = { user: { role: "CLIENT" } };
    const res = mockResponse();
    const next = jest.fn();

    requireRole("ADMIN")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Accès refusé" });
    expect(next).not.toHaveBeenCalled();
  });

  it("autorise un rôle attendu", () => {
    const req = { user: { role: "EMPLOYEE" } };
    const res = mockResponse();
    const next = jest.fn();

    requireRole("EMPLOYEE", "ADMIN")(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
