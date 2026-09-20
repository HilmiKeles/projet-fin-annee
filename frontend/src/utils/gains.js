export function normaliserGain(gain) {
  if (!gain || typeof gain !== "object") return null;

  const prize =
    gain.prize || gain.lot?.name || gain.lot?.libelle || "Lot";
  const code = gain.code || gain.ticketCode || gain.ticket?.code || "";
  const playedAt = gain.playedAt || gain.wonAt || gain.createdAt || null;

  return {
    id: gain.id || code,
    prize,
    code,
    claimed: Boolean(gain.claimed),
    playedAt,
  };
}

const LOTS = {
  infuseur: { emoji: "🍵", libelle: "Infuseur à thé" },
  detox: { emoji: "🌿", libelle: "Boîte de thé détox 100g" },
  signature: { emoji: "✨", libelle: "Boîte de thé signature 100g" },
  coffret39: { emoji: "🎁", libelle: "Coffret découverte (39€)" },
  coffret69: { emoji: "🏆", libelle: "Coffret découverte premium (69€)" },
};

export function detailsLot(prize) {
  if (LOTS[prize]) return LOTS[prize];

  const libelle = String(prize || "Lot");
  const lower = libelle.toLowerCase();
  if (lower.includes("infuseur")) return { ...LOTS.infuseur, libelle };
  if (lower.includes("détox") || lower.includes("detox")) {
    return { ...LOTS.detox, libelle };
  }
  if (lower.includes("signature")) return { ...LOTS.signature, libelle };
  if (lower.includes("39")) return { ...LOTS.coffret39, libelle };
  if (lower.includes("69")) return { ...LOTS.coffret69, libelle };
  return { emoji: "🎁", libelle };
}

export function extraireParticipations(data) {
  if (!data || typeof data !== "object") return [];

  const participations = Array.isArray(data.participations)
    ? data.participations
    : [];
  const gains = Array.isArray(data.gains) ? data.gains : [];
  const source =
    participations.length >= gains.length ? participations : gains;

  return source.map(normaliserGain).filter(Boolean);
}
