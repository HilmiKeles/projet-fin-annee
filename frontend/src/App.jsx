import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Participate from "./pages/Participate";
import EnterCode from "./pages/EnterCode";
import Profil from "./pages/Profil";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";
import Prizes from "./pages/Prizes";
import CGU from "./pages/CGU";
import Result from "./pages/Result";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";
import Reglement from "./pages/Reglement";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/participer" element={<Participate />} />
          <Route path="/saisie-code" element={<EnterCode />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/employe" element={<Employee />} />
          <Route path="/lots" element={<Prizes />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/resultat" element={<Result />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/reglement" element={<Reglement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}