const express = require("express");
const cors = require("cors");
const path = require("path"); // Adicionar esta linha
require("dotenv").config();


const { sequelize, testConnection } = require("./config/database");
// Importar os modelos
const { User, EncounterList, EncounterPokemon } = require("./models");

// Importar as rotas
const authRoutes = require("./routes/authRoutes");
const pokemonRoutes = require("./routes/pokemonRoutes");

// Inicializar o app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "../public")));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/admin", pokemonRoutes);

// Rota de teste
app.get("/api", (req, res) => {
  res.json({
    message: "API da Interface de Administração Pokémon está funcionando!",
  });
});

// Rota para a página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Resto do código permanece igual...