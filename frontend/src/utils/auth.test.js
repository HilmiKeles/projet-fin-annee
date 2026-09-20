import { destinationApresLogin } from "./auth";

describe("destinationApresLogin", () => {
  it("envoie un client vers l’accueil", () => {
    expect(destinationApresLogin({ role: "CLIENT" })).toBe("/");
  });

  it("envoie un admin vers le back-office", () => {
    expect(destinationApresLogin({ role: "ADMIN" })).toBe("/admin");
  });

  it("envoie un employé vers l’espace boutique", () => {
    expect(destinationApresLogin({ role: "EMPLOYEE" })).toBe("/employe");
  });
});
