import { useState } from 'react';
import '../styles/ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [envoye, setEnvoye] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prêt pour l'API backend
    console.log('Contact envoyé:', formData);
    setEnvoye(true);
    setFormData({ prenom: '', nom: '', email: '', sujet: '', message: '' });
  };

  const sujets = [
    'Question sur le jeu-concours',
    'Problème avec un code ticket',
    'Problème avec un lot/gain',
    'Demande partenariat',
    'Autre'
  ];

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <h1>Nous contacter</h1>
        <p>Une question sur le jeu-concours ? Nous sommes là pour vous aider.</p>
      </section>

      <div className="contact-container">
        <div className="contact-infos">
          <h2>Coordonnées</h2>
          <div className="info-block">
            <strong>Thé Tip Top</strong>
            <p>18 rue Léon Frot</p>
            <p>75011 Paris</p>
          </div>
          <div className="info-block">
            <strong>Email</strong>
            <p>contact@thetiptop.com</p>
          </div>
          <div className="info-block">
            <strong>Téléphone</strong>
            <p>01 23 45 67 89</p>
            <p>Du lundi au vendredi, 9h-18h</p>
          </div>
          <div className="info-block legal">
            <strong>Mentions légales</strong>
            <p>Ce site est un projet étudiant fictif.</p>
            <p>Aucun achat, aucune réservation réelle.</p>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {envoye ? (
            <div className="contact-success">
              <h2>Message envoyé !</h2>
              <p>Nous vous répondrons dans les 48h ouvrées.</p>
              <button 
                className="btn-primary"
                onClick={() => setEnvoye(false)}
              >
                Nouveau message
              </button>
            </div>
          ) : (
            <>
              <h2>Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="prenom">Prénom *</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nom">Nom *</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sujet">Sujet *</label>
                  <select
                    id="sujet"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    {sujets.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Décrivez votre demande..."
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Envoyer le message
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default ContactPage;