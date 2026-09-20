const { calculerKpis, estCtaAutorise, valeurLot } = require("../src/utils/kpis");

describe("valeurLot", () => {
  it("reconnaît les lots du jeu-concours", () => {
    expect(valeurLot("infuseur")).toBe(8);
    expect(valeurLot("coffret69")).toBe(69);
    expect(valeurLot("Boîte détox")).toBe(12);
  });
});

describe("estCtaAutorise", () => {
  it("n’accepte que les CTA connus", () => {
    expect(estCtaAutorise("je-participe")).toBe(true);
    expect(estCtaAutorise("inscription")).toBe(true);
    expect(estCtaAutorise("inconnu")).toBe(false);
    expect(estCtaAutorise("")).toBe(false);
  });
});

describe("calculerKpis", () => {
  const budgetInitial = process.env.CAMPAGNE_BUDGET;

  afterEach(() => {
    if (budgetInitial === undefined) {
      delete process.env.CAMPAGNE_BUDGET;
    } else {
      process.env.CAMPAGNE_BUDGET = budgetInitial;
    }
  });

  it("calcule conversion, clics et ROI", () => {
    delete process.env.CAMPAGNE_BUDGET;

    const kpis = calculerKpis({
      ticketsTotal: 100,
      ticketsUsed: 40,
      gains: [{ lot: { name: "infuseur" } }, { lot: { name: "coffret69" } }],
      clics: [{ name: "je-participe", _count: { name: 12 } }],
    });

    expect(kpis.tauxConversion).toBe(40);
    expect(kpis.valeurLots).toBe(77);
    expect(kpis.clicsCta).toBe(12);
    expect(kpis.budgetCampagne).toBe(15000);
    expect(kpis.roi).toBe(0.5);
    expect(kpis.clics.find((cta) => cta.name === "je-participe").total).toBe(12);
  });

  it("renvoie 0 % de conversion s’il n’y a aucun ticket", () => {
    const kpis = calculerKpis({
      ticketsTotal: 0,
      ticketsUsed: 0,
      gains: [],
      clics: [],
    });

    expect(kpis.tauxConversion).toBe(0);
    expect(kpis.clicsCta).toBe(0);
    expect(kpis.roi).toBe(0);
  });
});
