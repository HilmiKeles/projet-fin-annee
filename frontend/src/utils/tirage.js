export const DUREE_MELANGE_MS = 2800;
export const DUREE_MELANGE_REDUITE_MS = 400;

export function dureeAnimationTirage() {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return DUREE_MELANGE_REDUITE_MS;
  }
  return DUREE_MELANGE_MS;
}

export function attendre(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
