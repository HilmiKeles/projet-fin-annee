import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ReportIssuePage.css';

const ISSUE_TYPES = [
  { value: '', label: 'Sélectionnez un type de problème' },
  { value: 'site-web', label: 'Site web (affichage, navigation)' },
  { value: 'jeu-concours', label: 'Jeu-concours (ticket, code, lot)' },
  { value: 'compte', label: 'Compte client (connexion, profil)' },
  { value: 'paiement', label: 'Paiement en ligne' },
  { value: 'performance', label: 'Lenteur ou indisponibilité' },
  { value: 'autre', label: 'Autre problème' }
];

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    email: '',
    screenshot: null,
    consent: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Génération numéro de ticket fictif
    const ticket = `TT-${Date.now().toString(36).toUpperCase()}`;
    setTicketNumber(ticket);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="report-page">
        <div className="report-hero">
          <h1>Signalement envoyé</h1>
        </div>
        <div className="report-container">
          <div className="report-success">
            <div className="success-icon">✓</div>
            <h2>Merci pour votre signalement</h2>
            <p>
              Votre problème a bien été enregistré. Notre équipe technique l'examinera 
              dans les meilleurs délais.
            </p>
            <div className="ticket-box">
              <span>Votre numéro de ticket</span>
              <strong>{ticketNumber}</strong>
            </div>
            <p className="ticket-info">
              Un email de confirmation a été envoyé à <strong>{formData.email}</strong>. 
              Conservez ce numéro pour suivre l'avancement de votre demande.
            </p>
            <div className="report-actions">
              <Link to="/contact" className="btn-secondary">Nouveau signalement</Link>
              <Link to="/" className="btn-primary">Retour à l'accueil</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-hero">
        <div className="container">
          <h1>Signaler un problème</h1>
          <p>
            Une difficulté avec le site ou le jeu-concours ? Décrivez-nous le problème 
            rencontré et nous vous répondrons rapidement.
          </p>
        </div>
      </div>

      <div className="report-container">
        {/* FAQ rapide */}
        <div className="report-faq">
          <h3>Problèmes connus en cours de résolution</h3>
          <ul>
            <li>
              <strong>📧 Non réception des emails</strong>
              Vérifiez vos spams. Ajoutez contact@thetiptop.fr à vos contacts.
            </li>
            <li>
              <strong>🎫 Code ticket invalide</strong>
              Les codes sont sensibles aux majuscules. Vérifiez votre saisie.
            </li>
            <li>
              <strong>📱 Affichage mobile</strong>
              Actualisez la page ou videz le cache de votre navigateur.
            </li>
          </ul>
          <p className="faq-note">
            Si votre problème persiste, utilisez le formulaire ci-dessous.
          </p>
        </div>

        {/* Formulaire */}
        <div className="report-form-wrapper">
          <h2>Détaillez votre problème</h2>
          
          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label htmlFor="issueType">Type de problème *</label>
              <select
                id="issueType"
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                required
              >
                {ISSUE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description détaillée *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez le problème rencontré : quand s'est-il produit, quelles étapes avez-vous suivies, quel message d'erreur est apparu..."
                rows={5}
                required
                minLength={20}
              />
              <span className="field-hint">{formData.description.length}/500 caractères minimum recommandé</span>
            </div>

            <div className="form-group">
              <label htmlFor="screenshot">Capture d'écran (optionnel)</label>
              <input
                type="file"
                id="screenshot"
                name="screenshot"
                onChange={handleChange}
                accept="image/*"
              />
              <span className="field-hint">
                Formats acceptés : JPG, PNG, GIF. Max 5 Mo.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email de contact *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.fr"
                required
              />
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                />
                J'accepte que mes données soient utilisées pour le traitement de ce signalement conformément à la <Link to="/politique-confidentialite">politique de confidentialité</Link> *
              </label>
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={!formData.consent || !formData.issueType}
            >
              Envoyer le signalement
            </button>
          </form>
        </div>

        {/* Contact alternatif */}
        <div className="report-alt">
          <h3>Besoin d'une réponse urgente ?</h3>
          <p>
            Pour les problèmes critiques (site indisponible, faille de sécurité), 
            contactez directement notre équipe technique :
          </p>
          <ul>
            <li>📞 <a href="tel:+33123456789">01 23 45 67 89</a> (lun-ven, 9h-18h)</li>
            <li>✉️ <a href="mailto:urgence@thetiptop.fr">urgence@thetiptop.fr</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}