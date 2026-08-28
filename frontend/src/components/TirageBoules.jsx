import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DUREE_JOURS, dateClotureLisible, joursAvantCloture } from '../config/jeu.js';
import '../styles/TirageBoules.css';

const CODE_REGEX = /^[A-Z0-9]{10}$/;
const CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const DUREE_MELANGE = 2800;

// Poids identiques à la répartition réelle des 500 000 tickets gagnants.
const LOTS = [
  { emoji: '🍵', titre: 'Infuseur à thé', poids: 60 },
  { emoji: '🌿', titre: 'Boîte de thé détox 100g', poids: 20 },
  { emoji: '⭐', titre: 'Thé signature 100g', poids: 10 },
  { emoji: '🎁', titre: 'Coffret découverte 39 €', poids: 6 },
  { emoji: '💝', titre: 'Coffret de luxe 69 €', poids: 4 },
];

// Billes qui s'agitent dans la sphère (position et taille en % de la sphère).
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

function empreinte(code) {
  let valeur = 7;
  for (let i = 0; i < code.length; i += 1) {
    valeur = (valeur * 31 + code.charCodeAt(i)) % 2147483647;
  }
  return valeur || 7;
}

// Générateur pseudo-aléatoire déterministe : un même code donne toujours le même lot.
function generateur(graine) {
  let etat = graine % 2147483647;
  if (etat <= 0) etat += 2147483646;
  return () => {
    etat = (etat * 48271) % 2147483647;
    return (etat - 1) / 2147483646;
  };
}

// TODO : remplacer par l'appel API POST /api/tickets/validate quand le back sera prêt.
function composerTirage(code) {
  const suivant = generateur(empreinte(code));
  const total = LOTS.reduce((somme, lot) => somme + lot.poids, 0);
  let curseur = suivant() * total;
  const lot = LOTS.find((element) => (curseur -= element.poids) < 0) ?? LOTS[0];
  return { code, lot };
}

function codeExemple() {
  return Array.from(
    { length: 10 },
    () => CARACTERES[Math.floor(Math.random() * CARACTERES.length)],
  ).join('');
}

function animationsReduites() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function TirageBoules({ connecte = false }) {
  const [code, setCode] = useState('');
  const [erreur, setErreur] = useState('');
  const [etape, setEtape] = useState('saisie');
  const [tirage, setTirage] = useState(null);

  // Laisse les boules se mélanger, puis affiche le lot.
  useEffect(() => {
    if (etape !== 'tirage' || !tirage) return undefined;

    const delai = animationsReduites() ? 400 : DUREE_MELANGE;
    const chrono = setTimeout(() => setEtape('resultat'), delai);
    return () => clearTimeout(chrono);
  }, [etape, tirage]);

  function saisirCode(e) {
    const valeur = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setCode(valeur);
    setErreur('');
  }

  function lancerTirage(e) {
    e.preventDefault();

    if (!CODE_REGEX.test(code)) {
      setErreur('Le code doit contenir exactement 10 caractères (lettres et chiffres).');
      return;
    }

    setErreur('');
    setTirage(composerTirage(code));
    setEtape('tirage');
  }

  function recommencer() {
    setEtape('saisie');
    setTirage(null);
    setCode('');
  }

  let annonce = '';
  if (etape === 'tirage') annonce = 'Mélange des boules en cours.';
  if (etape === 'resultat' && tirage) annonce = `Tirage terminé. Votre lot : ${tirage.lot.titre}.`;

  return (
    <div className="loto">
      <div className={`loto-machine${etape === 'tirage' ? ' loto-machine-active' : ''}`}>
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

      <div className="loto-panneau">
        {etape === 'saisie' && (
          <form className="loto-form" onSubmit={lancerTirage}>
            <label htmlFor="code-loto">Code de votre ticket de caisse</label>
            <input
              id="code-loto"
              type="text"
              value={code}
              onChange={saisirCode}
              placeholder="ABC123XYZ9"
              autoComplete="off"
              maxLength={10}
              aria-describedby="loto-compteur"
            />
            <span className="loto-compteur" id="loto-compteur">{code.length}/10</span>

            {erreur && <p className="loto-erreur" role="alert">{erreur}</p>}

            <button type="submit" className="loto-btn">Lancer le tirage</button>
            <button
              type="button"
              className="loto-lien"
              onClick={() => { setCode(codeExemple()); setErreur(''); }}
            >
              Utiliser un code d'exemple
            </button>
          </form>
        )}

        {etape === 'tirage' && (
          <p className="loto-attente">Mélange des boules…</p>
        )}

        {etape === 'resultat' && tirage && (
          <div className="loto-resultat">
            <p className="loto-resultat-mention">Ticket {tirage.code} — vous remportez</p>
            <p className="loto-resultat-lot">
              <span aria-hidden="true">{tirage.lot.emoji}</span> {tirage.lot.titre}
            </p>

            <div className="loto-grand-tirage">
              <h3>Et maintenant, le grand tirage</h3>
              <p>
                Le jeu-concours dure {DUREE_JOURS} jours. À sa clôture, le{' '}
                <strong>{dateClotureLisible()}</strong>, un participant remportera
                le gros lot : <strong>un an de thé offert (360 €)</strong>.
              </p>
              <p className="loto-rebours">
                Plus que {joursAvantCloture()} jours pour vous inscrire
              </p>
              <Link to={connecte ? '/profil' : '/inscription'} className="loto-btn">
                Je participe au grand tirage
              </Link>
            </div>

            <button type="button" className="loto-lien" onClick={recommencer}>
              Saisir un autre code
            </button>
          </div>
        )}
      </div>

      <p className="loto-annonce" aria-live="polite">{annonce}</p>
    </div>
  );
}
