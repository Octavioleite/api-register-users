import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

// Array para armazenar pautas
const issues = [];

// Endpoint para obter todas as pautas
app.get("/issues", (req, res) => {
  return res.json(issues);
});

// Endpoint para adicionar uma nova pauta
app.post("/issues", (req, res) => {
  const { title } = req.body;

  const newIssue = {
    id: Math.random().toString(36).substring(2, 9), // Gerar um ID único
    title,
    votesFor: 0,
    votesAgainst: 0,
  };

  issues.push(newIssue);
  return res.json(newIssue);
});

// Endpoint para votar em uma pauta
app.post("/issues/:id/vote", (req, res) => {
  const { id } = req.params;
  const { vote } = req.body; // "for" ou "against"

  const issue = issues.find((issue) => issue.id === id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  if (vote === "for") {
    issue.votesFor++;
  } else if (vote === "against") {
    issue.votesAgainst++;
  } else {
    return res.status(400).json({ error: "Invalid vote" });
  }

  return res.json(issue);
});

// Endpoint para deletar uma pauta
app.delete("/issues/:id", (req, res) => {
  const { id } = req.params;

  const index = issues.findIndex((issue) => issue.id === id);
  if (index < 0) {
    return res.status(404).json({ error: "Issue not found" });
  }

  issues.splice(index, 1);
  return res.status(204).json();
});

app.listen(port, () => console.log(`listening on ${port}`));
