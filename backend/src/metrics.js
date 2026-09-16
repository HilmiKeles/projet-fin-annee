const client = require("prom-client");

// Collecte automatique des métriques par défaut (CPU, mémoire, event loop...)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Compteur de requêtes HTTP (métrique custom, très parlante pour la soutenance)
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Nombre total de requêtes HTTP",
  labelNames: ["method", "route", "status"],
});

module.exports = { client, httpRequestsTotal };