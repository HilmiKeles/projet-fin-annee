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
