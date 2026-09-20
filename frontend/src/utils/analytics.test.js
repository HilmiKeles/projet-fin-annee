import { analyticsAutorisees, envoyerEvenementGa, suivreCta } from './analytics';

describe('analytics', () => {
  it('refuse les événements GA sans consentement', () => {
    expect(analyticsAutorisees()).toBe(false);
    window.gtag = vi.fn();
    envoyerEvenementGa('cta_click', { cta_id: 'je-participe' });
    expect(window.gtag).not.toHaveBeenCalled();
  });

  it('envoie le clic CTA à l’API first-party', () => {
    suivreCta('je-participe');
    expect(fetch).toHaveBeenCalledWith(
      '/api/analytics/cta',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'je-participe' }),
      }),
    );
  });

  it('appelle gtag si les analytics sont acceptées', () => {
    localStorage.setItem(
      'thetiptop_cookie_consent',
      JSON.stringify({ analytics: true }),
    );
    window.gtag = vi.fn();
    envoyerEvenementGa('cta_click', { cta_id: 'je-participe' });
    expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', {
      cta_id: 'je-participe',
    });
  });
});
