import "../styles/Legal.css";

export default function Reglement() {
  return (
    <main className="legal">
      <article className="legal-card">
        <h1>Règlement du jeu-concours</h1>

        <div className="legal-alerte" role="note">
          ⚠️ Jeu-concours fictif organisé dans un cadre pédagogique — aucun lot
          réel ne sera distribué.
        </div>

        <h2>Article 1 — Organisation</h2>
        <p>
          La société <strong>Thé Tip Top</strong> (SA au capital de 150 000 €,
          18 rue Léon Frot, 75011 Paris) organise un jeu-concours avec tirage au
          sort à l'occasion de l'ouverture de sa 10ᵉ boutique à Nice.
        </p>

        <h2>Article 2 — Participation</h2>
        <p>
          Tout client disposant d'un ticket de caisse ou d'une facture
          supérieure à <strong>49 €</strong> reçoit un code unique de 10
          caractères. La participation s'effectue sur ce site après création
          d'un compte, pendant les 30 jours du jeu puis 30 jours supplémentaires
          après clôture. 500 000 tickets maximum sont distribués.
        </p>

        <h2>Article 3 — Gains</h2>
        <p>100 % des tickets sont gagnants :</p>
        <ul>
          <li>60 % : un infuseur à thé</li>
          <li>20 % : une boîte de 100 g de thé détox ou d'infusion</li>
          <li>10 % : une boîte de 100 g de thé signature</li>
          <li>6 % : un coffret découverte (valeur 39 €)</li>
          <li>4 % : un coffret découverte (valeur 69 €)</li>
        </ul>
        <p>
          Les lots sont à retirer en boutique ou livrables via le site. À
          l'issue du jeu, un <strong>tirage au sort</strong> parmi tous les
          participants désignera le gagnant d'<strong>un an de thé</strong>
          (valeur 360 €).
        </p>

        <h2>Article 4 — Données personnelles</h2>
        <p>
          Les données collectées sont traitées conformément à notre{" "}
          <a href="/confidentialite">politique de confidentialité</a>.
        </p>
      </article>
    </main>
  );
}