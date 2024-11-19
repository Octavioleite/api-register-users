import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

const users = [];
const agenda = [];
const votos = {}; // Objeto para armazenar votos por usuário e pauta

// Rota inicial
app.get("/", (req, res) => {
  return res.json("API rodando");
});

// Rota para obter todos os usuários
app.get("/users", (req, res) => {
  return res.json(users);
});

// Rota para obter todas as pautas
app.get("/agenda", (req, res) => {
  return res.json(agenda);
});

// Rota para adicionar um novo usuário
app.post("/users", (req, res) => {
  const { name, cpf, numberApto, email } = req.body;
  console.log("Nome:", name, "CPF:", cpf, "Número da Unidade:", numberApto, "E-mail:", email);

  const newUser = {
    id: Math.random().toString(36),
    name,
    cpf,
    numberApto,
    email,
  };

  users.push(newUser);
  return res.json(newUser);
});

// Rota para adicionar uma nova pauta
app.post("/agenda", (req, res) => {
  const { tema, describ } = req.body;

  if (!tema || !describ) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  console.log("Tema:", tema, "Descrição:", describ);

  const newAgenda = {
    id: Math.random().toString(36).substring(2, 9),
    tema,
    describ,
    VotFavor: 0,
    VotNfavor: 0,
  };

  agenda.push(newAgenda);
  return res.json(newAgenda);
});

// Rota para votar em uma pauta
app.post("/agenda/votar", (req, res) => {
  const { pautaId, userId, voto } = req.body;

  // Verifica se todos os campos estão presentes
  if (!pautaId || !userId || !voto) {
    return res.status(400).json({ error: "Dados incompletos para votação" });
  }

  // Encontra a pauta pelo ID
  const pauta = agenda.find((item) => item.id === pautaId);
  if (!pauta) {
    return res.status(404).json({ error: "Pauta não encontrada" });
  }

  // Verifica se o usuário já votou nessa pauta
  if (!votos[pautaId]) votos[pautaId] = new Set();
  if (votos[pautaId].has(userId)) {
    return res.status(400).json({ error: "Usuário já votou nesta pauta" });
  }

  // Registra o voto
  votos[pautaId].add(userId);

  if (voto === "favor") {
    pauta.VotFavor += 1;
  } else if (voto === "naoFavor") {
    pauta.VotNfavor += 1;
  }

  return res.json({ message: "Voto registrado com sucesso", pauta });
});

// Rota para deletar um usuário
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((user) => user.id === id);

  if (index < 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  users.splice(index, 1);
  return res.status(204).send();
});

// Rota para deletar uma pauta
app.delete("/agenda/:id", (req, res) => {
  const { id } = req.params;
  const index = agenda.findIndex((item) => item.id === id);

  if (index < 0) {
    return res.status(404).json({ error: "Pauta não encontrada" });
  }

  agenda.splice(index, 1);
  return res.status(204).send();
});

app.listen(port, () => console.log(`API rodando na porta ${port}`));
