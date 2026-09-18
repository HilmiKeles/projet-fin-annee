import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { estAdmin, estEmploye, lireSession, viderSession } from "../utils/auth";
import "../styles/Header.css";

export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [user, setUser] = useState(lireSession);
  const navigate = useNavigate();

  useEffect(() => {
    const rafraichir = () => setUser(lireSession());
    window.addEventListener("auth-change", rafraichir);
    return () => window.removeEventListener("auth-change", rafraichir);
  }, []);

  const toggleMenu = () => setMenuOuvert(!menuOuvert);
  const fermerMenu = () => setMenuOuvert(false);

  const handleLogout = () => {
    viderSession();
    fermerMenu();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo" onClick={fermerMenu}>
          <img className="logo-icon" src="/logo_TipTop.png" alt="Thé Tip Top" />
          <span className="logo-text">Thé Tip Top</span>
        </Link>

        {/* Bouton burger (mobile) */}
        <button
          className={`burger ${menuOuvert ? "burger-open" : ""}`}
          onClick={toggleMenu}
          aria-label="Menu de navigation"
          aria-expanded={menuOuvert}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={`header-nav ${menuOuvert ? "nav-open" : ""}`}>
          <NavLink
            to="/"
            onClick={fermerMenu}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Accueil
          </NavLink>
          <NavLink
            to="/lots"
            onClick={fermerMenu}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Lots à gagner
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/entrer-code"
                onClick={fermerMenu}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Saisir un code
              </NavLink>
              <NavLink
                to="/profil"
                onClick={fermerMenu}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Mon profil
              </NavLink>
              {(estAdmin(user) || estEmploye(user)) && (
                <NavLink
                  to={estAdmin(user) ? "/admin" : "/employe"}
                  onClick={fermerMenu}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  {estAdmin(user) ? "Administration" : "Espace employé"}
                </NavLink>
              )}
              <button onClick={handleLogout} className="nav-link nav-logout">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/connexion"
                onClick={fermerMenu}
                className="nav-link"
              >
                Connexion
              </NavLink>
              <NavLink
                to="/inscription"
                onClick={fermerMenu}
                className="nav-link"
              >
                Participer
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
