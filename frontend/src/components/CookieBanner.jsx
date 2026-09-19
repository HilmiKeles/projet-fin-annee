import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CookieBanner.css';

const CLE_CONSENTEMENT = 'thetiptop_cookie_consent';
const EVENEMENT_OUVRIR = 'ouvrir-bandeau-cookies';

const DEFAUT = {
  necessaires: true,
  analytics: false,
  marketing: false,
};

function lireConsentement() {
  try {
    const brut = localStorage.getItem(CLE_CONSENTEMENT);
    return brut ? JSON.parse(brut) : null;
  } catch {
    return null;
  }
}

function enregistrerConsentement(preferences) {
  const consentement = {
    ...DEFAUT,
    ...preferences,
    necessaires: true,
    date: new Date().toISOString(),
  };
  localStorage.setItem(CLE_CONSENTEMENT, JSON.stringify(consentement));
  window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: consentement }));
  return consentement;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [personnaliser, setPersonnaliser] = useState(false);
  const [preferences, setPreferences] = useState(DEFAUT);

  useEffect(() => {
    if (!lireConsentement()) {
      setVisible(true);
    }

    const ouvrir = () => {
      const actuel = lireConsentement();
      setPreferences(actuel ? { ...DEFAUT, ...actuel } : DEFAUT);
      setPersonnaliser(Boolean(actuel));
      setVisible(true);
    };

    window.addEventListener(EVENEMENT_OUVRIR, ouvrir);
    return () => window.removeEventListener(EVENEMENT_OUVRIR, ouvrir);
  }, []);

  const fermer = (choix) => {
    enregistrerConsentement(choix);
    setVisible(false);
    setPersonnaliser(false);
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-titre"
      aria-describedby="cookie-texte"
    >
      <div className="cookie-banner-inner">
        <div className="cookie-banner-contenu">
          <span className="cookie-banner-icone" aria-hidden="true">🍪</span>
          <div>
            <h2 id="cookie-titre">Vos cookies</h2>
            <p id="cookie-texte">
              Ce site utilise des cookies nécessaires à son fonctionnement (connexion,
              sécurité). Les cookies optionnels (audience, marketing) ne sont déposés
              qu’avec votre accord.{' '}
              <Link to="/confidentialite">Politique de confidentialité</Link>
            </p>
          </div>
        </div>

        {personnaliser && (
          <fieldset className="cookie-prefs">
            <legend>Personnaliser mes choix</legend>

            <label className="cookie-pref">
              <input type="checkbox" checked disabled />
              <span>
                <strong>Nécessaires</strong>
                Connexion, sécurité et mémorisation de vos choix cookies. Toujours actifs.
              </span>
            </label>

            <label className="cookie-pref">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) =>
                  setPreferences((p) => ({ ...p, analytics: e.target.checked }))
                }
              />
              <span>
                <strong>Mesure d’audience</strong>
                Statistiques anonymes pour améliorer le site. Aucun suivi publicitaire.
              </span>
            </label>

            <label className="cookie-pref">
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) =>
                  setPreferences((p) => ({ ...p, marketing: e.target.checked }))
                }
              />
              <span>
                <strong>Marketing</strong>
                Cookies de réseaux sociaux ou de communication commerciale.
              </span>
            </label>
          </fieldset>
        )}

        <div className="cookie-banner-actions">
          <button
            type="button"
            className="cookie-btn cookie-btn-refuser"
            onClick={() => fermer({ analytics: false, marketing: false })}
          >
            Tout refuser
          </button>
          <button
            type="button"
            className="cookie-btn cookie-btn-perso"
            onClick={() => {
              if (personnaliser) {
                fermer(preferences);
              } else {
                setPersonnaliser(true);
              }
            }}
          >
            {personnaliser ? 'Enregistrer mes choix' : 'Personnaliser'}
          </button>
          <button
            type="button"
            className="cookie-btn cookie-btn-accepter"
            onClick={() => fermer({ analytics: true, marketing: true })}
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
