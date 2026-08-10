import { Link } from "react-router-dom";

export default function Prizes() {
  const lots = [
    {
      name: "Infuseur à thé",
      share: "60 % des tickets",
      description:
        "Un infuseur à thé élégant et réutilisable, pour déguster vos thés en vrac partout.",
    },
    {
      name: "Boîte de 100 g de thé détox ou d'infusion",
      share: "20 % des tickets",
      description:
        "Une boîte de 100 g de notre thé détox ou de notre infusion bio, pour un moment de bien-être.",
    },
    {
      name: "Boîte de 100 g de thé signature",
      share: "10 % des tickets",
      description:
        "Notre mélange signature exclusif, créé par nos experts, dans une boîte de 100 g.",
    },
    {
      name: "Coffret découverte d'une valeur de 39 €",
      share: "6 % des tickets",
      description:
        "Un assortiment de nos meilleurs thés pour découvrir l'univers Thé Tip Top.",
    },
    {
      name: "Coffret découverte d'une valeur de 69 €",
      share: "4 % des tickets",
      description:
        "Le coffret découverte premium : une sélection généreuse de thés haut de gamme et d'accessoires.",
    },
  ];

  return (
    <>
      <h1>Les lots à gagner au jeu-concours Thé Tip Top</h1>
      <p>
        100% des tickets sont gagnants ! Chaque code saisi vous fait
        remporter l'un des lots suivants, selon un tirage au sort réalisé
        automatiquement et de manière sécurisée par notre application.
      </p>

      <ul className="prizes-list">
        {lots.map((lot) => (
          <li key={lot.name} className="prize-card">
            <h2>{lot.name}</h2>
            <p className="prize-share">{lot.share}</p>
            <p>{lot.description}</p>
          </li>
        ))}
      </ul>

      <section>
        <h2>Le grand tirage final : 1 an de thé d'une valeur de 360 €</h2>
        <p>
          En plus de ces gains immédiats, tous les participants sont
          automatiquement inscrits au grand tirage au sort de fin de jeu. Le
          grand gagnant remportera un an de thé d'une valeur de 360 € !
        </p>
        <Link to="/inscription" className="btn-primary">
          Je tente ma chance
        </Link>
      </section>
    </>
  );
}