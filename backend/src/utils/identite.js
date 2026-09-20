function identifiantUtilisateur(req) {
  const candidat =
    req.user?.userId || req.user?.id || req.user?.sub || req.userId;
  if (!candidat) return undefined;
  return String(candidat);
}

module.exports = { identifiantUtilisateur };
