const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");
const adminRoutes = require("./routes/admin");
// CORRECTION : on pointe bien vers le dossier routes
const usersRouter = require("./routes/users");
const { client, httpRequestsTotal } = require("./metrics");

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
// AJOUT : on active la route pour le frontend
app.use("/api/users", usersRouter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Si l'API est exposée directement (port 4000), interdire l'indexation
app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send("User-agent: *\nDisallow: /\n");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
