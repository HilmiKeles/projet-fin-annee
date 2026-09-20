import { useEffect, useRef } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export default function GoogleButton({ onSuccess, text = "signin_with" }) {
  const buttonRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!CLIENT_ID) {
      return undefined;
    }

    let annule = false;
    let timer;
    let script;

    const init = () => {
      if (
        annule ||
        initialized.current ||
        !buttonRef.current ||
        !window.google?.accounts?.id
      ) {
        return;
      }
      initialized.current = true;
      try {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: onSuccess,
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text,
          locale: "fr",
        });
      } catch (e) {
        initialized.current = false;
        console.error("Google init error:", e);
      }
    };

    if (window.google?.accounts?.id) {
      init();
    } else {
      script = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
      script.addEventListener("load", init);
      timer = setInterval(init, 100);
    }

    return () => {
      annule = true;
      initialized.current = false;
      if (script) {
        script.removeEventListener("load", init);
      }
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [onSuccess, text]);

  if (!CLIENT_ID) return null;

  return (
    <div className="google-btn-container">
      <div ref={buttonRef} />
    </div>
  );
}
