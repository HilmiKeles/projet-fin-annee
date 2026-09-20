import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Result.css";

// On garde juste les visuels, les titres viendront directement de ta base de données
const GAINS = {
  infuseur: {
    emoji: "🍵",
    libelle: "Infuseur à thé",
    description: "L'accessoire indispensable pour savourer vos thés en vrac.",
  },
  detox: {
    emoji: "🌿",
    libelle: "Boîte de thé détox 100g",
    description: "Un mélange bio et handmade pour prendre soin de vous.",
  },
  signature: {
    emoji: "✨",
    libelle: "Boîte de thé signature 100g",
    description: "Notre mélange exclusif, créé par nos maîtres du thé.",
  },
  coffret39: {
    emoji: "🎁",
    libelle: "Coffret découverte (39€)",
    description: "Une sélection de nos meilleurs thés à découvrir.",
  },
  coffret69: {
    emoji: "🏆",
    libelle: "Coffret découverte premium (69€)",
    description: "Le grand gagnant ! Notre coffret le plus prestigieux.",
  },
};

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  // On récupère le nom exact renvoyé par le backend (ex: "Coffret découverte 69€")
  const gainDb = location.state?.gain;

  // 1. Correction de la 404 : on redirige bien vers /entrer-code
  useEffect(() => {
    if (!gainDb) {
      navigate("/entrer-code", { replace: true });
    }
  }, [gainDb, navigate]);

  if (!gainDb) return null;

  // 2. Détection intelligente du lot pour afficher le bon émoji
  let visuals = {
    emoji: "🎉",
    libelle: gainDb,
    description: "Un magnifique cadeau vous attend !",
  };
  const gainLower = gainDb.toLowerCase();

  if (gainLower.includes("infuseur")) visuals = { ...GAINS.infuseur };
  else if (gainLower.includes("détox") || gainLower.includes("detox"))
    visuals = { ...GAINS.detox };
  else if (gainLower.includes("signature")) visuals = { ...GAINS.signature };
  else if (gainLower.includes("39")) visuals = { ...GAINS.coffret39 };
  else if (gainLower.includes("69")) visuals = { ...GAINS.coffret69 };

  return (
    <main className="result">
      <div className="result-card">
        <span className="confetti">🎉</span>
        <h1>Félicitations !</h1>
        <div className="gain-emoji" role="img" aria-label={visuals.libelle}>
          {visuals.emoji}
        </div>

        <h2>{visuals.libelle}</h2>
        <p className="gain-description">{visuals.description}</p>

        <div className="result-info">
          <p>
            📍 <strong>Comment récupérer votre gain ?</strong>
          </p>
          <p>
            Présentez-vous dans l'une de nos boutiques avec votre ticket de
            caisse ou votre facture pour retirer votre lot.
          </p>
        </div>

        <div className="result-actions">
          {/* Correction de la route /mon-compte en /profil */}
          <Link to="/profil" className="btn-primary">
            Voir mon historique
          </Link>
          <Link to="/" className="btn-secondary">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
