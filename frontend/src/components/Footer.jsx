import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import { FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Section principale */}
      <div className="footer-main">
        <div className="footer-main-container">
          {/* Logo et réseaux */}
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <img className="footer-logo-icon" src="../logo_TipTop.png" alt="Thé Tip Top" />
              <span className="footer-brand-text">Thé Tip Top</span>
            </div>
            <div className="footer-brand-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://instagram.com/thetiptop_projet" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaXTwitter />
              </a>
            </div>
          </div>

          {/* Colonne Navigation */}
          <div className="footer-col">
            <h3>Navigation</h3>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/lots">Lots à gagner</Link></li>
              <li><Link to="/saisie-code">Participer</Link></li>
              <li><Link to="/connexion">Connexion</Link></li>
            </ul>
          </div>

          {/* Colonne Informations */}
          <div className="footer-col">
            <h3>Informations</h3>
            <ul>
              <li><Link to="/mentions-legales">Mentions légales</Link></li>
              <li><Link to="/cgu">CGU du jeu-concours</Link></li>
              <li><Link to="/reglement">Règlement du jeu</Link></li>
              <li><Link to="/confidentialite">Politique de confidentialité</Link></li>
              <li><Link to="/contact">Contact</Link></li>  {/* AJOUTE CELUI-CI */}
            </ul>
          </div>

          {/* Colonne Contact */}
          <div className="footer-col">
            <h3>Contact</h3>
            <ul className="footer-contact-list">
              <li>📍 18 rue Léon Frot, 75011 Paris</li>
              <li>📞 01 23 45 67 89</li>
              <li>✉️ contact@thetiptop.fr</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barre du bas */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Thé Tip Top — Projet étudiant fictif réalisé par l'agence Furious Ducks.
        </p>
        <p className="footer-legal-note">
          Aucun achat, gain ou réservation réel ne peut être effectué sur ce site.
          Les données collectées sont uniquement destinées à la démonstration du jeu-concours.
        </p>
      </div>
    </footer>
  );
}