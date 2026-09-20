const VALEUR_LOTS_EUR = {
  infuseur: 8,
  detox: 12,
  signature: 15,
  coffret39: 39,
  coffret69: 69,
};

const LIBELLES_CTA = {
  "je-participe": "Je participe",
  "je-participe-maintenant": "Je participe maintenant",
  "voir-lots": "Voir le détail des lots",
  "lancer-tirage": "Lancer le tirage",
  "valider-code": "Valider mon code",
  inscription: "Créer un compte",
};

function arrondir(valeur) {
  return Math.round(Number(valeur) * 10) / 10;
}

function valeurLot(nom) {
  if (VALEUR_LOTS_EUR[nom]) return VALEUR_LOTS_EUR[nom];
  const lower = String(nom || "").toLowerCase();
  if (lower.includes("69")) return 69;
  if (lower.includes("39")) return 39;
  if (lower.includes("infuseur")) return 8;
  if (lower.includes("détox") || lower.includes("detox")) return 12;
  if (lower.includes("signature")) return 15;
  return 10;
}

function budgetCampagne() {
  const brut = Number(process.env.CAMPAGNE_BUDGET);
  return Number.isFinite(brut) && brut > 0 ? brut : 15000;
}

function formaterClics(groupes = []) {
  const parNom = Object.fromEntries(
    Object.keys(LIBELLES_CTA).map((name) => [name, 0]),
  );

  for (const groupe of groupes) {
    const name = groupe.name;
    const total = groupe._count?.name || groupe._count?._all || 0;
    if (parNom[name] !== undefined) {
      parNom[name] = total;
    }
  }

  return Object.entries(parNom).map(([name, total]) => ({
    name,
    libelle: LIBELLES_CTA[name],
    total,
  }));
}

function calculerKpis({ ticketsTotal, ticketsUsed, gains, clics }) {
  const totalTickets = Number(ticketsTotal) || 0;
  const ticketsUtilises = Number(ticketsUsed) || 0;
  const tauxConversion = totalTickets
    ? arrondir((ticketsUtilises / totalTickets) * 100)
    : 0;
  const valeurLots = (gains || []).reduce(
    (somme, gain) => somme + valeurLot(gain.lot?.name),
    0,
  );
  const budget = budgetCampagne();
  const clicsDetails = formaterClics(clics);
  const clicsCta = clicsDetails.reduce((somme, item) => somme + item.total, 0);

  return {
    tauxConversion,
    clicsCta,
    clics: clicsDetails,
    valeurLots,
    budgetCampagne: budget,
    roi: budget ? arrondir((valeurLots / budget) * 100) : 0,
  };
}

function estCtaAutorise(name) {
  return Boolean(LIBELLES_CTA[String(name || "")]);
}

module.exports = {
  LIBELLES_CTA,
  VALEUR_LOTS_EUR,
  calculerKpis,
  estCtaAutorise,
  valeurLot,
};
