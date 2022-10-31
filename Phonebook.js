const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

app.use(express.static("build"));
app.use(cors());
app.use(express.json()); //middleware

const generateId = () => {
  const id = Math.floor(Math.random() * 101);
  return id;
};

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/info/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/info", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing",
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "The name already exists in the phonebook",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  response.json(person);
});

app.delete("/api/info/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  //MIDDLEWARE
  response.status(404).send({ error: "unknown endpoint" });
};

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
