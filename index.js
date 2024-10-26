import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

const users = [];
const pautas = []; // Array para armazenar as pautas

// Endpoint para obter todas as pautas
app.get("/pautas", (req, res) => {
  return res.json(pautas);
});

// Endpoint para adicionar uma nova pauta
app.post("/pautas", (req, res) => {
  const { descricao } = req.body;

  const newPauta = {
    id: Math.random().toString(36).substr(2, 9), // ID gerado aleatoriamente
    descricao,
    votos: 0, // Inicializa os votos como 0
  };

  pautas.push(newPauta);
  return res.json(newPauta);
});

// Endpoint para atualizar o número de votos de uma pauta
app.put("/pautas/:id", (req, res) => {
  const { id } = req.params;
  const { votos } = req.body;

  const index = pautas.findIndex((pauta) => pauta.id === id);

  if (index < 0) {
    return res.status(404).json({ error: "Pauta não encontrada" });
  }

  pautas[index].votos = votos; // Atualiza o número de votos
  return res.json(pautas[index]);
});

app.get("/", (req, res) => {
  return res.json("hello world");
});

app.get("/users", (req, res) => {
  return res.json(users); 
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  const newUser = {
    id: Math.random().toString(36).substr(2, 9), // ID gerado aleatoriamente
    name,
    email,
  };

  users.push(newUser);
  return res.json(newUser);
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const index = users.findIndex((user) => user.id === id);

  if (index < 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  users.splice(index, 1);
  return res.status(204).json();
});

app.listen(port, () => console.log(`listening on ${port}`));
