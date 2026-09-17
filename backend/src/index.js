const app = require("./app");
const logger = require("./logger");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`API Thé Tip Top démarrée`, {
    port: PORT,
    env: process.env.NODE_ENV,
  });
});
