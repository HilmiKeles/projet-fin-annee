import { detailsLot, extraireParticipations } from "./gains";

describe("detailsLot", () => {
  it("reconnaît un identifiant de lot", () => {
    expect(detailsLot("infuseur")).toEqual({
      emoji: "🍵",
      libelle: "Infuseur à thé",
    });
  });

  it("reconnaît un libellé en français", () => {
    expect(detailsLot("Boîte de thé détox 100g").emoji).toBe("🌿");
  });
});

describe("extraireParticipations", () => {
  it("préfère la liste la plus longue", () => {
    const liste = extraireParticipations({
      gains: [],
      participations: [{ prize: "infuseur", code: "ABCDEFGHIJ" }],
    });
    expect(liste).toHaveLength(1);
    expect(liste[0].code).toBe("ABCDEFGHIJ");
  });
});
