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

  if (!descricao) {
    return res.status(400).json({ error: "Descrição da pauta é obrigatória" });
  }

  const newPauta = {
    id: Math.random().toString(36).substr(2, 9), // ID gerado aleatoriamente
    descricao,
    votos: 0, // Inicializa os votos como 0
  };

  pautas.push(newPauta);
  return res.status(201).json(newPauta); // Retorna o novo objeto criado
});

// Endpoint para votar em uma pauta
app.put("/pautas/:id/votar", (req, res) => {
  const { id } = req.params;

  const index = pautas.findIndex((pauta) => pauta.id === id);

  if (index < 0) {
    return res.status(404).json({ error: "Pauta não encontrada" });
  }

  pautas[index].votos += 1; // Incrementa o número de votos
  return res.json(pautas[index]); // Retorna a pauta atualizada
});

// Endpoint para obter todos os usuários
app.get("/users", (req, res) => {
  return res.json(users); 
});

// Endpoint para adicionar um novo usuário
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios" });
  }

  const newUser = {
    id: Math.random().toString(36).substr(2, 9), // ID gerado aleatoriamente
    name,
    email,
  };

  users.push(newUser);
  return res.status(201).json(newUser); // Retorna o novo objeto criado
});

// Endpoint para remover um usuário
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const index = users.findIndex((user) => user.id === id);

  if (index < 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  users.splice(index, 1);
  return res.status(204).json(); // Retorna status 204 sem conteúdo
});

app.listen(port, () => console.log(`listening on ${port}`));
