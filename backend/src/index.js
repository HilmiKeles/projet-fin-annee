require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");
const adminRoutes = require("./routes/admin");
const newsletterRoutes = require("./routes/newsletter");
// CORRECTION : on pointe bien vers le dossier routes
const usersRouter = require("./routes/users");
const { client, httpRequestsTotal } = require("./metrics");
const logger = require("./logger");
const { assurerCompteAdmin } = require("./services/adminBootstrap");

const app = express();

app.use(cors());
app.use(express.json());

// Middleware pour incrémenter le compteur de requêtes HTTP
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });

    // Log de chaque requête HTTP vers Elasticsearch
    logger.info("Requête HTTP", {
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
      ip: req.ip,
    });
  });
  next();
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);
// AJOUT : on active la route pour le frontend
app.use("/api/users", usersRouter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Si l'API est exposée directement (port 4000), interdire l'indexation
app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send("User-agent: *\nDisallow: /\n");
});

// Middleware de gestion des erreurs (à placer après les routes)
app.use((err, req, res, next) => {
  logger.error("Erreur serveur", {
    message: err.message,
    route: req.path,
    method: req.method,
  });
  res.status(500).json({ error: "Erreur interne du serveur" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await assurerCompteAdmin();
  } catch (erreur) {
    logger.error("Impossible d'initialiser le compte admin", {
      message: erreur.message,
    });
  }
  logger.info(`API Thé Tip Top démarrée`, { port: PORT, env: process.env.NODE_ENV });
});