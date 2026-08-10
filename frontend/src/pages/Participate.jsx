import { useState } from 'react';

export default function Participate() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO : appel API POST /api/participate { code }
    // En attendant, simulation locale :
    if (/^[A-Z0-9]{10}$/i.test(code)) {
      setResult({ win: true, prize: 'Infuseur à thé' });
    } else {
      setResult({ win: false, error: 'Code invalide : 10 caractères attendus (lettres et chiffres)' });
    }
  };

  return (
    <>
      <h1>Saisissez votre code</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="code">Code à 10 caractères (sur votre ticket de caisse)</label>
        <input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={10}
          pattern="[A-Za-z0-9]{10}"
          required
        />
        <button type="submit">Valider mon code</button>
      </form>

      {result && (
        <div role="alert">
          {result.win ? `🎉 Félicitations ! Vous avez gagné : ${result.prize}` : result.error}
        </div>
      )}
    </>
  );
}