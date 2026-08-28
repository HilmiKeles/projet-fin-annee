import { useEffect, useRef } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleButton({ onSuccess }) {
  const buttonRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!CLIENT_ID || initialized.current) return;
    initialized.current = true;

    const init = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: onSuccess,
          // PAS de auto_select ni de prompt automatique
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 300, // ⚠️ nombre en pixels, JAMAIS "100%"
        });
        // ⚠️ NE PAS appeler window.google.accounts.id.prompt() ici
      } catch (e) {
        console.error('Google init error:', e);
      }
    };

    if (window.google) {
      init();
    } else {
      // Le script est déjà chargé via <script> dans index.html :
      // on attend qu'il soit prêt
      const timer = setInterval(() => {
        if (window.google) {
          clearInterval(timer);
          init();
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [onSuccess]);

  if (!CLIENT_ID) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
      <div ref={buttonRef} />
    </div>
  );
}