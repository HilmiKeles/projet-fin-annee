const client = require("prom-client");

if (process.env.NODE_ENV !== "test") {
  client.collectDefaultMetrics();
}

const httpRequestsTotal =
  client.register.getSingleMetric("http_requests_total") ||
  new client.Counter({
    name: "http_requests_total",
    help: "Nombre total de requêtes HTTP",
    labelNames: ["method", "route", "status"],
  });

module.exports = { client, httpRequestsTotal };