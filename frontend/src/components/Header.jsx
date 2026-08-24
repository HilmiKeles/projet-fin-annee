import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/Header.css";

export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  // Récupération de l'utilisateur connecté (adapté à votre sessionStorage)
  const user = JSON.parse(sessionStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOuvert(!menuOuvert);
  const fermerMenu = () => setMenuOuvert(false);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    fermerMenu();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo" onClick={fermerMenu}>
        <img className="logo-icon" src="../logo_TipTop.png" alt="Thé Tip Top" />
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
              {(user.role === "admin" || user.role === "employe") && (
                <NavLink
                  to={user.role === "admin" ? "/admin" : "/employe"}
                  onClick={fermerMenu}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  {user.role === "admin" ? "Administration" : "Espace employé"}
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
