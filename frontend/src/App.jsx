import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import EnterCode from "./pages/EnterCode";
import Profil from "./pages/Profil";
import Admin from "./pages/Admin";
import Employe from "./pages/Employe";
import CGU from "./pages/CGU";
import Result from "./pages/Result";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";
import Reglement from "./pages/Reglement";
import NotFound from "./pages/NotFound";
import Lots from "./pages/Lots";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/saisie-code" element={<EnterCode />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/employe" element={<Employe />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/resultat" element={<Result />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/reglement" element={<Reglement />} />
          <Route path="/lots" element={<Lots />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}