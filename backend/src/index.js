const app = require("./app");
const logger = require("./logger");
const { assurerCompteAdmin } = require("./services/adminBootstrap");

const PORT = process.env.PORT || 3000;

async function demarrer() {
  try {
    await assurerCompteAdmin();
  } catch (erreur) {
    logger.error("Impossible d'initialiser le compte administrateur", {
      message: erreur.message,
    });
  }

  app.listen(PORT, () => {
    logger.info(`API Thé Tip Top démarrée`, {
      port: PORT,
      env: process.env.NODE_ENV,
    });
  });
}

demarrer();
