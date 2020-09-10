const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const index = findIndex(repositories, id);
  if (!repositoryExists(index)) {
    return response.status(400).json();
  }

  let repo = repositories[index];
  
  repo = {
    ...repo,
    title,
    url,
    techs
  };

  repositories.splice(index, 1, repo);

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;
  const index = findIndex(repositories, id);

  if (!repositoryExists(index)) {
    return response.status(400).json();
  }
  
  repositories.splice(index, 1);
  
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;
  const index = findIndex(repositories, id);

  if (!repositoryExists(index)) {
    return response.status(400).json();
  }

  let repo = repositories[index];

  repo = {
    ...repo,
    likes: repo.likes + 1
  }

  repositories.splice(index, 1, repo);

  return response.json(repo);
});

const findIndex = (repositories, id) => 
  repositories.findIndex(repo => repo.id === id);

const repositoryExists = index => index > -1;

module.exports = app;
