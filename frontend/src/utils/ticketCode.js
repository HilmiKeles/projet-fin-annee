export const CODE_REGEX = /^[A-Z0-9]{10}$/;

export function normaliserCode(valeur) {
  return valeur.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
}

export function estCodeValide(code) {
  return CODE_REGEX.test(code);
}
