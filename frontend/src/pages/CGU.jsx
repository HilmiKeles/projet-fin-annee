import '../styles/Legal.css';

export default function CGU() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <h1>Conditions Générales d'Utilisation du Jeu-Concours</h1>
        <p className="legal-date">Dernière mise à jour : {new Date().getFullYear()}</p>

        <section className="legal-section">
          <h2>Article 1 — Présentation du jeu-concours</h2>
          <p>
            Thé Tip Top, société anonyme au capital de 150 000€, immatriculée au RCS de Paris 
            sous le numéro [RCS à compléter], dont le siège social est situé au 
            18 rue Léon Frot, 75011 Paris, organise un jeu-concours gratuit sans obligation d'achat 
            intitulé <strong>« Grand Jeu-Concours Thé Tip Top »</strong>.
          </p>
          <p>
            Ce jeu est proposé à l'occasion de l'ouverture de la 10ème boutique Thé Tip Top à Nice, 
            dans le but de promouvoir les gammes de thés de l'entreprise et de fidéliser la clientèle.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 2 — Conditions de participation</h2>
          <h3>2.1 Éligibilité</h3>
          <p>Le jeu-concours est ouvert à toute personne physique majeure résidant en France métropolitaine, à l'exclusion de :</p>
          <ul>
            <li>Les salariés et préposés de la société Thé Tip Top ;</li>
            <li>Les membres de leur famille immédiate (conjoint, ascendants, descendants) ;</li>
            <li>Toute personne ayant participé à l'élaboration ou à l'organisation du jeu.</li>
          </ul>

          <h3>2.2 Modalités de participation</h3>
          <p>La participation au jeu-concours se fait exclusivement selon les modalités suivantes :</p>
          <ul>
            <li>
              <strong>Par ticket de caisse :</strong> Tout client effectuant un achat d'un montant 
              supérieur ou égal à 49€ dans une boutique Thé Tip Top recevra un ticket de caisse 
              comportant un code à 10 caractères (chiffres et lettres).
            </li>
            <li>
              <strong>Par internet :</strong> Le participant doit se rendre sur le site 
              <strong> dsp5-archi-[votre-classe]-[votre-groupe].fr</strong>, créer un compte 
              utilisateur ou se connecter, puis saisir son code dans l'espace dédié.
            </li>
          </ul>
          <p>
            <strong>Limitation :</strong> Un seul code par ticket de caisse. Un même participant 
            peut participer plusieurs fois s'il dispose de plusieurs tickets valides.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 3 — Déroulement du jeu et gains</h2>
          <p>100% des codes sont gagnants. La répartition des lots est la suivante :</p>

          <table className="legal-table">
            <thead>
              <tr>
                <th>Gain</th>
                <th>Pourcentage</th>
                <th>Valeur approximative</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Infuseur à thé</td>
                <td>60%</td>
                <td>8€</td>
              </tr>
              <tr>
                <td>Boîte de 100g de thé détox ou infusion</td>
                <td>20%</td>
                <td>12€</td>
              </tr>
              <tr>
                <td>Boîte de 100g de thé signature</td>
                <td>10%</td>
                <td>15€</td>
              </tr>
              <tr>
                <td>Coffret découverte</td>
                <td>6%</td>
                <td>39€</td>
              </tr>
              <tr>
                <td>Grand tirage au sort (1 an de thé d'une valeur de 360€)</td>
                <td>4%</td>
                <td>360€</td>
              </tr>
            </tbody>
          </table>

          <p>
            Le tirage au sort est effectué automatiquement par l'application côté serveur 
            au moment de la saisie du code. Le résultat s'affiche immédiatement et le lot 
            est crédité sur le compte du participant.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 4 — Conservation et retrait des lots</h2>
          <p>
            Les lots gagnés sont conservés sur le compte du participant pendant une durée de 
            <strong> 12 mois</strong> à compter de la date de gain. Passé ce délai, le lot sera 
            considéré comme périmé et ne pourra plus être réclamé.
          </p>
          <p>
            Le retrait des lots s'effectue exclusivement en boutique Thé Tip Top sur présentation :
          </p>
          <ul>
            <li>Du compte utilisateur validé ;</li>
            <li>D'une pièce d'identité en cours de validité ;</li>
            <li>Du ticket de caisse original (pour les gains liés à un achat).</li>
          </ul>
          <p>
            Un employé Thé Tip Top validera le retrait dans le système et marquera le lot 
            comme « remis ». Aucun envoi postal n'est possible.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 5 — Données personnelles et RGPD</h2>
          <p>
            Les données personnelles collectées (nom, prénom, adresse email, date de naissance, 
            sexe, historique de gains) sont utilisées pour :
          </p>
          <ul>
            <li>La gestion du jeu-concours et l'attribution des lots ;</li>
            <li>L'envoi de communications marketing (avec consentement explicite) ;</li>
            <li>Les analyses statistiques anonymisées pour Thé Tip Top.</li>
          </ul>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi 
            Informatique et Libertés modifiée, vous disposez d'un droit d'accès, de rectification, 
            de suppression, de limitation et de portabilité de vos données.
          </p>
          <p>
            Pour exercer ces droits ou pour toute question relative à vos données, contactez :
            <br />
            <strong>Email :</strong> dpo@thetiptop.fr
            <br />
            <strong>Adresse :</strong> Thé Tip Top — DPO, 18 rue Léon Frot, 75011 Paris
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 6 — Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments du site (logos, marques, graphismes, textes, photographies) 
            sont la propriété exclusive de Thé Tip Top ou de ses partenaires. Toute reproduction, 
            représentation ou utilisation, totale ou partielle, sans autorisation préalable écrite 
            est strictement interdite.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 7 — Limitation de responsabilité</h2>
          <p>
            Thé Tip Top ne saurait être tenue responsable en cas de :
          </p>
          <ul>
            <li>Dysfonctionnement technique du site empêchant temporairement la participation ;</li>
            <li>Perte de codes ou tickets de caisse par le participant ;</li>
            <li>Fraudes ou utilisations frauduleuses de codes ;</li>
            <li>Force majeure empêchant la tenue du jeu.</li>
          </ul>
          <p>
            Thé Tip Top se réserve le droit d'annuler, de reporter ou de modifier le jeu-concours 
            en cas de circonstances exceptionnelles, sans que cela ne puisse donner lieu à indemnisation.
          </p>
        </section>

        <section className="legal-section">
          <h2>Article 8 — Droit applicable et litiges</h2>
          <p>
            Les présentes CGU sont soumises au droit français. En cas de litige, une solution 
            amiable sera recherchée préalablement. À défaut, les tribunaux compétents seront ceux 
            du ressort du siège social de Thé Tip Top.
          </p>
        </section>

        <section className="legal-section legal-highlight">
          <h2>⚠️ Projet étudiant fictif</h2>
          <p>
            Ce site et ce jeu-concours sont réalisés dans le cadre d'un <strong>projet étudiant fictif</strong> 
            par l'agence <strong>Furious Ducks</strong>. Aucun achat réel, aucun gain réel et aucune 
            réservation ne peuvent être effectués sur ce site. Les données collectées ne sont pas 
            utilisées à des fins commerciales réelles.
          </p>
        </section>
      </div>
    </main>
  );
}