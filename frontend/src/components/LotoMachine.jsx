import "../styles/TirageBoules.css";

const BILLES = [
  { gauche: 16, haut: 62, taille: 15, delai: 0 },
  { gauche: 31, haut: 74, taille: 13, delai: -0.4 },
  { gauche: 46, haut: 66, taille: 17, delai: -0.9 },
  { gauche: 61, haut: 77, taille: 12, delai: -1.3 },
  { gauche: 72, haut: 63, taille: 16, delai: -0.6 },
  { gauche: 24, haut: 46, taille: 12, delai: -1.7 },
  { gauche: 54, haut: 49, taille: 14, delai: -2.1 },
  { gauche: 68, haut: 43, taille: 11, delai: -1.1 },
  { gauche: 38, haut: 55, taille: 13, delai: -2.6 },
  { gauche: 79, haut: 72, taille: 13, delai: -0.2 },
  { gauche: 11, haut: 76, taille: 12, delai: -1.9 },
  { gauche: 50, haut: 82, taille: 15, delai: -2.3 },
];

export default function LotoMachine({ actif = false }) {
  return (
    <div className={`loto-machine${actif ? " loto-machine-active" : ""}`}>
      <div className="loto-sphere">
        {BILLES.map((bille, index) => (
          <span
            key={`bille-${index}`}
            className="loto-bille"
            style={{
              left: `${bille.gauche}%`,
              top: `${bille.haut}%`,
              width: `${bille.taille}%`,
              animationDelay: `${bille.delai}s`,
            }}
            aria-hidden="true"
          />
        ))}
        <span className="loto-reflet" aria-hidden="true" />
      </div>
      <span className="loto-goulotte" aria-hidden="true" />
      <span className="loto-pied" aria-hidden="true" />
    </div>
  );
}
