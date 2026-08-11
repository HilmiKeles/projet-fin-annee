import "../styles/Legal.css";

export default function Reglement() {
  return (
    <main className="legal-page">
      <article className="legal-container">
        <h1>Règlement du jeu-concours</h1>
        <p className="legal-date">Édition 2026 — Ouverture 10ème boutique Nice</p>

        <section className="legal-section legal-highlight">
          <h2>⚠️ Jeu-concours fictif</h2>
          <p>
            Ce jeu-concours est organisé dans un <strong>cadre pédagogique</strong> 
            dans le cadre d'un projet étudiant. Aucun lot réel ne sera distribué, 
            aucun achat n'est réellement effectué sur ce site.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 1 — Organisation du jeu</h2>
          <p>
            La société <strong>Thé Tip Top</strong> — Société anonyme au capital 
            de 150 000 €, immatriculée au RCS de Paris sous le numéro [à compléter], 
            dont le siège social est situé au <strong>18 rue Léon Frot, 75011 Paris</strong>, 
            représentée par M. Eric Bourdon, gérant,
          </p>
          <p>
            organise un jeu-concours avec tirage au sort gratuit sans obligation d'achat, 
            intitulé <strong>« Grand Jeu-Concours Thé Tip Top — 10ème boutique à Nice »</strong>.
          </p>
          <p>
            <strong>Agence réalisatrice :</strong> Furious Ducks — Spécialiste des 
            technologies open source.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 2 — Calendrier du jeu</h2>
          <ul>
            <li><strong>Date de début :</strong> [Date d'ouverture de la boutique à Nice]</li>
            <li><strong>Date de fin des participations :</strong> 30 jours après le début</li>
            <li><strong>Date de fin des réclamations :</strong> 30 jours après la fin des participations</li>
            <li><strong>Tirage au sort final :</strong> Dans les 15 jours suivant la fin des réclamations</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Article 3 — Conditions de participation</h2>
          
          <h3>3.1 Éligibilité</h3>
          <p>Le jeu est ouvert à toute personne physique majeure résidant en France métropolitaine, à l'exclusion de :</p>
          <ul>
            <li>Les salariés, préposés et collaborateurs de Thé Tip Top et de l'agence Furious Ducks</li>
            <li>Les membres de leur famille immédiate (conjoint, ascendants, descendants et fratrie)</li>
            <li>Toute personne ayant participé à l'élaboration technique du jeu</li>
          </ul>

          <h3>3.2 Modalités de participation</h3>
          <p>
            <strong>Achat en boutique :</strong> Tout client effectuant un achat d'un montant 
            supérieur ou égal à <strong>49 € TTC</strong> reçoit un ticket de caisse comportant 
            un <strong>code unique à 10 caractères</strong> (chiffres et lettres).
          </p>
          <p>
            <strong>Participation en ligne :</strong> Le participant doit :
          </p>
          <ol>
            <li>Créer un compte sur le site <em>dsp5-archi-[classe]-[groupe].fr</em></li>
            <li>Saisir son code à 10 caractères dans l'espace dédié</li>
            <li>Découvrir immédiatement son gain</li>
          </ol>
          <p>
            <strong>Participation sans achat :</strong> [Si applicable — mentionner la procédure 
            de demande gratuite de code]
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 4 — Dotation et répartition des gains</h2>
          <p>
            <strong>500 000 tickets gagnants</strong> sont mis en jeu. 100 % des tickets 
            sont gagnants selon la répartition suivante :
          </p>

          <table className="legal-table">
            <thead>
              <tr>
                <th>Gain</th>
                <th>Proportion</th>
                <th>Quantité</th>
                <th>Valeur approximative</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Infuseur à thé</td>
                <td>60 %</td>
                <td>300 000</td>
                <td>~ 10 €</td>
              </tr>
              <tr>
                <td>Boîte de 100 g de thé détox ou infusion</td>
                <td>20 %</td>
                <td>100 000</td>
                <td>~ 15 €</td>
              </tr>
              <tr>
                <td>Boîte de 100 g de thé signature</td>
                <td>10 %</td>
                <td>50 000</td>
                <td>~ 18 €</td>
              </tr>
              <tr>
                <td>Coffret découverte</td>
                <td>6 %</td>
                <td>30 000</td>
                <td>39 €</td>
              </tr>
              <tr>
                <td>Coffret découverte premium</td>
                <td>4 %</td>
                <td>20 000</td>
                <td>69 €</td>
              </tr>
            </tbody>
          </table>

          <h3>4.2 Grand tirage au sort final</h3>
          <p>
            À l'issue de la période de participation, un <strong>tirage au sort</strong> sera 
            effectué parmi l'ensemble des participants ayant validé leur code. Le gagnant 
            remportera <strong>un an de thé</strong>, soit une valeur de <strong>360 €</strong> 
            (30 € par mois pendant 12 mois).
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 5 — Attribution et retrait des gains</h2>
          
          <h3>5.1 Gains instantanés</h3>
          <p>Les gains découverts immédiatement après saisie du code sont à :</p>
          <ul>
            <li><strong>Retirer en boutique :</strong> Présentation du compte et d'une pièce d'identité dans l'une des boutiques Thé Tip Top</li>
            <li><strong>Livraison :</strong> Sur simple demande dans l'espace client, frais de port offerts</li>
          </ul>

          <h3>5.2 Grand tirage au sort</h3>
          <p>
            Le gagnant sera contacté par email dans les 15 jours suivant le tirage. À défaut 
            de réponse dans les 15 jours, un nouveau tirage sera effectué.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 6 — Données personnelles et RGPD</h2>
          <p>
            Les données collectées (nom, prénom, email, adresse, historique de participation) 
            sont traitées par Thé Tip Top et son prestataire technique Furious Ducks.
          </p>
          <ul>
            <li><strong>Finalité :</strong> Gestion du jeu, attribution des lots, communication commerciale (avec consentement)</li>
            <li><strong>Durée de conservation :</strong> 3 ans après la fin du jeu, ou jusqu'à révocation du consentement</li>
            <li><strong>Droits :</strong> Accès, rectification, effacement, portabilité — exercables auprès de contact@thetiptop.com</li>
          </ul>
          <p>
            Pour plus de détails, consultez notre <a href="/confidentialite">politique de confidentialité</a>.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 7 — Responsabilité et litiges</h2>
          <p>
            Thé Tip Top se réserve le droit d'annuler le jeu en cas de force majeure ou de 
            fraude avérée. Tout litige relatif à l'interprétation du présent règlement sera 
            soumis à la juridiction compétente du siège social de Thé Tip Top.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 8 — Règlement complet</h2>
          <p>
            Le règlement complet est disponible sur simple demande écrite à :
          </p>
          <ul>
            <li><strong>Email :</strong> contact@thetiptop.com</li>
            <li><strong>Adresse postale :</strong> Thé Tip Top — Service Jeu-Concours, 18 rue Léon Frot, 75011 Paris</li>
          </ul>
        </section>

        <section className="legal-section legal-highlight">
          <h2>📋 Documents associés</h2>
          <p>
            Consultez également nos autres documents légaux :
          </p>
          <ul>
            <li><a href="/cgu">Conditions générales d'utilisation</a></li>
            <li><a href="/mentions-legales">Mentions légales</a></li>
            <li><a href="/confidentialite">Politique de confidentialité (RGPD)</a></li>
          </ul>
        </section>
      </article>
    </main>
  );
}