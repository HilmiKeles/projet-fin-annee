import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Result.css";

// Correspondance gain → emoji et description (aligné sur les pourcentages du cahier des charges)
const GAINS = {
  infuseur: {
    emoji: "🍵",
    titre: "Un infuseur à thé !",
    description: "L'accessoire indispensable pour savourer vos thés en vrac.",
  },
  detox: {
    emoji: "🌿",
    titre: "Une boîte de 100g de thé détox !",
    description: "Un mélange bio et handmade pour prendre soin de vous.",
  },
  signature: {
    emoji: "✨",
    titre: "Une boîte de 100g de thé signature !",
    description: "Notre mélange exclusif, créé par nos maîtres du thé.",
  },
  coffret39: {
    emoji: "🎁",
    titre: "Un coffret découverte (39€) !",
    description: "Une sélection de nos meilleurs thés à découvrir.",
  },
  coffret69: {
    emoji: "🏆",
    titre: "Un coffret découverte premium (69€) !",
    description: "Le grand gagnant ! Notre coffret le plus prestigieux.",
  },
};

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const gain = location.state?.gain;

  // Sécurité : si on arrive sur la page sans gain, on redirige vers la saisie
  useEffect(() => {
    if (!gain || !GAINS[gain]) {
      navigate("/saisie-code", { replace: true });
    }
  }, [gain, navigate]);

  if (!gain || !GAINS[gain]) return null;

  const { emoji, titre, description } = GAINS[gain];

  return (
    <main className="result">
      <div className="result-card">
        <span className="confetti">🎉</span>
        <h1>Félicitations !</h1>
        <div className="gain-emoji" role="img" aria-label={titre}>
          {emoji}
        </div>
        <h2>{titre}</h2>
        <p className="gain-description">{description}</p>

        <div className="result-info">
          <p>
            📍 <strong>Comment récupérer votre gain ?</strong>
          </p>
          <p>
            Présentez-vous dans l'une de nos boutiques avec votre ticket de caisse
            ou votre facture pour retirer votre lot.
          </p>
        </div>

        <div className="result-actions">
          <Link to="/mon-compte" className="btn-primary">
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