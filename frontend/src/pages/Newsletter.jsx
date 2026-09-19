import { Link } from "react-router-dom";
import NewsletterForm from "../components/NewsletterForm.jsx";
import { dateClotureLisible } from "../config/jeu.js";
import "../styles/Newsletter.css";

const RUBRIQUES = [
  {
    emoji: "🍵",
    titre: "Thé du mois",
    texte: "Découvrez nos mélanges bio, les nouveautés boutique et nos conseils d'infusion.",
  },
  {
    emoji: "🎁",
    titre: "Jeu-concours",
    texte: "Rappels des dates, lots encore en jeu et modalités du grand tirage de clôture.",
  },
  {
    emoji: "🌿",
    titre: "Recettes & rituels",
    texte: "Une recette simple à préparer à la maison, pour savourer le thé autrement.",
  },
];

export default function Newsletter() {
  return (
    <div className="nl-page">
      <section className="nl-hero">
        <p className="nl-kicker">Infolettre mensuelle</p>
        <h1>La newsletter Thé Tip Top</h1>
        <p>
          Recettes, ouvertures de boutiques et actualités du jeu-concours,
          directement dans votre boîte mail. Inscription gratuite, désinscription
          en un clic.
        </p>
      </section>

      <section className="nl-avantages">
        <h2>Ce que vous recevez</h2>
        <div className="nl-avantages-grid">
          {RUBRIQUES.map((rubrique) => (
            <article key={rubrique.titre} className="nl-avantage">
              <span aria-hidden="true">{rubrique.emoji}</span>
              <h3>{rubrique.titre}</h3>
              <p>{rubrique.texte}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="nl-apercu" aria-labelledby="apercu-titre">
        <div className="nl-apercu-intro">
          <h2 id="apercu-titre">Aperçu du numéro de septembre</h2>
          <p>
            Voici le type de contenu envoyé à nos abonnés. Aucun e-mail réel
            n'est expédié : ce site est un projet étudiant fictif.
          </p>
        </div>

        <article className="nl-lettre">
          <header className="nl-lettre-entete">
            <p className="nl-lettre-marque">Thé Tip Top</p>
            <p className="nl-lettre-numero">Infolettre n° 9 — septembre 2026</p>
            <h3>Nice nous ouvre ses portes, et le grand jeu continue</h3>
          </header>

          <div className="nl-lettre-corps">
            <p>
              Chère lectrice, cher lecteur, l'automne s'installe et nos thés
              d'exception aussi. Ce mois-ci, on célèbre l'ouverture de la
              10<sup>e</sup> boutique à Nice et on vous rappelle que{" "}
              <strong>100 % des tickets sont gagnants</strong>.
            </p>

            <h4>🍵 Le thé du mois</h4>
            <p>
              Notre mélange signature bio, assemblé à la main : notes de bergamote,
              de miel et une touche florale. Parfait en infusion à 85 °C pendant
              3 minutes.
            </p>

            <h4>🎁 Le jeu-concours</h4>
            <p>
              Avec un achat de 49 € ou plus, récupérez votre code à 10 caractères
              et lancez le tirage. Le grand tirage de clôture a lieu le{" "}
              <strong>{dateClotureLisible()}</strong> : un an de thé offert,
              d'une valeur de 360 €.
            </p>
            <p>
              <Link to="/lots">Voir les lots</Link>
              {" · "}
              <Link to="/entrer-code">Saisir un code</Link>
            </p>

            <h4>🌿 Recette : thé glacé pêche-menthe</h4>
            <ol>
              <li>Infusez 4 g de thé vert dans 50 cl d'eau à 80 °C, 2 minutes.</li>
              <li>Laissez refroidir, puis ajoutez des lamelles de pêche et quelques feuilles de menthe.</li>
              <li>Servez très frais, sans sucres ajoutés si possible.</li>
            </ol>
          </div>

          <footer className="nl-lettre-pied">
            Projet étudiant fictif — Furious Ducks. Aucun achat réel.
          </footer>
        </article>
      </section>

      <section className="nl-inscription" id="inscription">
        <div className="nl-inscription-card">
          <h2>S'inscrire à la newsletter</h2>
          <p>
            Une lettre par mois environ, aucun partage de votre adresse à des
            partenaires commerciaux.
          </p>
          <NewsletterForm variante="page" />
          <p className="nl-inscription-note">
            Vous pouvez vous désinscrire à tout moment depuis{" "}
            <Link to="/newsletter/desinscription">cette page</Link> ou votre{" "}
            <Link to="/profil">profil</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
