jest.mock("nodemailer");

const nodemailer = require("nodemailer");
const { envoyerEmail, urlApplication } = require("../src/services/mail");

describe("envoi d'e-mail", () => {
  const sendMail = jest.fn();

  beforeEach(() => {
    sendMail.mockResolvedValue({ messageId: "1" });
    nodemailer.createTransport.mockReturnValue({ sendMail });
    process.env.SMTP_HOST = "mailpit";
    process.env.SMTP_PORT = "1025";
    process.env.SMTP_FROM = "Thé Tip Top <noreply@thetiptop.fr>";
    delete process.env.SMTP_USER;
    delete process.env.SMTP_SECURE;
    delete process.env.PUBLIC_APP_URL;
    delete process.env.SITE_ADDRESS;
  });

  it("envoie un message via le serveur SMTP", async () => {
    await envoyerEmail({
      to: "jean@example.com",
      subject: "Sujet",
      text: "Bonjour",
      html: "<p>Bonjour</p>",
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: "mailpit",
      port: 1025,
      secure: false,
    });
    expect(sendMail).toHaveBeenCalledWith({
      from: "Thé Tip Top <noreply@thetiptop.fr>",
      to: "jean@example.com",
      subject: "Sujet",
      text: "Bonjour",
      html: "<p>Bonjour</p>",
    });
  });

  it("refuse d'envoyer si aucun serveur n'est configuré", async () => {
    delete process.env.SMTP_HOST;

    await expect(
      envoyerEmail({ to: "jean@example.com", subject: "Sujet", text: "Bonjour" }),
    ).rejects.toThrow(/SMTP/);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("construit l'adresse publique du site", () => {
    process.env.PUBLIC_APP_URL = "http://localhost:5173/";
    expect(urlApplication()).toBe("http://localhost:5173");

    delete process.env.PUBLIC_APP_URL;
    process.env.SITE_ADDRESS = "dsp5-archi-024a-g3.fr";
    expect(urlApplication()).toBe("https://dsp5-archi-024a-g3.fr");
  });
});
