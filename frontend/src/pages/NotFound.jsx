import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

export default function NotFound() {
  return (
    <main className="notfound">
      <div className="notfound-card">
        <span className="notfound-code">404</span>
        <h1>Oups ! Cette page a été infusée trop longtemps 🍵</h1>
        <p>
          La page que vous cherchez n'existe pas ou a été déplacée.
          Pas d'inquiétude, il reste plein de thé à déguster par ici !
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn-primary">Retour à l'accueil</Link>
          <Link to="/participer" className="btn-secondary">Participer au jeu</Link>
        </div>
      </div>
    </main>
  );
}