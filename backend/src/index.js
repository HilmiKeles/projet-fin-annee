const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");
const adminRoutes = require("./routes/admin");
// CORRECTION : on pointe bien vers le dossier routes
const usersRouter = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

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
