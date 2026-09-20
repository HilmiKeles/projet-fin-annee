const bcrypt = require("bcryptjs");
const { assurerCompteAdmin } = require("../src/services/adminBootstrap");
const { prisma } = require("@prisma/client");

describe("assurerCompteAdmin", () => {
  it("crée ou met à jour le compte ADMIN_EMAIL même si un autre admin existe", async () => {
    process.env.ADMIN_EMAIL = "admin@thetiptop.fr";
    process.env.ADMIN_PASSWORD = "Admin123!";
    prisma.user.upsert.mockResolvedValue({
      id: "admin-1",
      email: "admin@thetiptop.fr",
      role: "ADMIN",
    });

    await assurerCompteAdmin();

    expect(prisma.user.upsert).toHaveBeenCalledTimes(1);
    const appel = prisma.user.upsert.mock.calls[0][0];
    expect(appel.where.email).toBe("admin@thetiptop.fr");
    expect(appel.create.role).toBe("ADMIN");
    expect(appel.update.role).toBe("ADMIN");
    expect(await bcrypt.compare("Admin123!", appel.create.password)).toBe(true);
    expect(await bcrypt.compare("Admin123!", appel.update.password)).toBe(true);
  });
});
