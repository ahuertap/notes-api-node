const express = require('express');
const cors = require('cors');
const logger = require('./loggerMiddleware');

const app = express();

/* A middleware that parses the body of the request. (POST) */
app.use(express.json());

app.use(cors());
app.use(logger);

let notes = [
  {
    id: 1,
    content: 'HTML is easy, but CSS is hard',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T17:30:31.098Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
];

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  }
  res.status(404).end();
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

app.post('/api/notes', (req, res) => {
  const body = req.body;

  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);

  const note = {
    id: maxId + 1,
    content: body.content,
    date: new Date().toISOString(),
    important: typeof body.important !== 'undefined' ? body.important : false,
  };

  notes = [...notes, note];
  res.status(201).json(note);
});

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  const note = notes.find((note) => note.id === id);
  if (note) {
    note.content = body.content;
    note.important = body.important;
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.use((req, res) => {
  console.log(req.path);
  res.status(404).json({
    error: 'Not found',
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
