const { validatePassword } = require("../src/utils/password");

describe("validatePassword", () => {
  it("rejette un mot de passe absent", () => {
    expect(validatePassword(undefined)).toBe(
      "Le mot de passe doit contenir au moins 8 caractères.",
    );
  });

  it("rejette un mot de passe trop court", () => {
    expect(validatePassword("Ab1!")).toBe(
      "Le mot de passe doit contenir au moins 8 caractères.",
    );
  });

  it("exige une majuscule", () => {
    expect(validatePassword("password1!")).toBe(
      "Le mot de passe doit contenir au moins une majuscule.",
    );
  });

  it("exige une minuscule", () => {
    expect(validatePassword("PASSWORD1!")).toBe(
      "Le mot de passe doit contenir au moins une minuscule.",
    );
  });

  it("exige un caractère spécial", () => {
    expect(validatePassword("Password1")).toBe(
      "Le mot de passe doit contenir au moins un caractère spécial.",
    );
  });

  it("accepte un mot de passe conforme", () => {
    expect(validatePassword("Password1!")).toBeNull();
  });
});
