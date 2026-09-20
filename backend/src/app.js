const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");
const adminRoutes = require("./routes/admin");
const usersRouter = require("./routes/users");
const newsletterRoutes = require("./routes/newsletter");
const { client, httpRequestsTotal } = require("./metrics");
const logger = require("./logger");

const app = express();

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });

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
app.use("/api/users", usersRouter);
app.use("/api/newsletter", newsletterRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send("User-agent: *\nDisallow: /\n");
});

app.use((err, req, res, next) => {
  logger.error("Erreur serveur", {
    message: err.message,
    route: req.path,
    method: req.method,
  });
  res.status(500).json({ error: "Erreur interne du serveur" });
});

module.exports = app;
