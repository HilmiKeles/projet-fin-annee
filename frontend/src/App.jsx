// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';

// Pages
import Home from './pages/Home.jsx'; 
import Reglement from './pages/Reglement.jsx'; 
import EnterCode from './pages/EnterCode.jsx';   
import Connexion from './pages/Connexion.jsx'; 
import Inscription from './pages/Inscription.jsx';
import Profil from './pages/Profil.jsx';
import Lots from './pages/Lots.jsx';
import Result from './pages/Result.jsx';
import Admin from './pages/Admin.jsx';
import Employe from './pages/Employe.jsx';
import MentionsLegales from './pages/MentionsLegales.jsx';
import CGU from './pages/CGU.jsx';
import Confidentialite from './pages/Confidentialite.jsx';
import NotFound from './pages/NotFound.jsx';
import ContactPage from './pages/ContactPage';
import ReportIssuePage from './pages/ReportIssuePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Toutes les routes, aucune protégée */}
          <Route path="/" element={<Home />} />
          <Route path="/reglement" element={<Reglement />} />
          <Route path="/entrer-code" element={<EnterCode />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/lots" element={<Lots />} />
          <Route path="/resultat" element={<Result />} />
          <Route path="/employe" element={<Employe />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signaler-probleme" element={<ReportIssuePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;