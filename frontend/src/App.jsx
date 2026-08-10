import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EnterCode from './pages/EnterCode';
import Profile from './pages/Profile';
import Employee from './pages/Employee';
import Admin from './pages/Admin';
import CGU from './pages/CGU';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/saisie-code" element={<EnterCode />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/employe" element={<Employee />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cgu" element={<CGU />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;