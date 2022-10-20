const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3001;
const db = require("./db/db.json");
const { v4: uuidv4 } = require('uuid');;
const { readFromFile, readAndAppend, readAndDelete } = require('./routes/readWriteFiles');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

app.get("/api/notes", (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
})



app.post("/api/notes", function (req, res) {
  console.log(req.body);
  const { title, text } = req.body;
  
  if (req.body) {
    const newNote = {
      title, 
      text,
      id: uuidv4()
    };
    readAndAppend(newNote, './db/db.json');
    res.json(`Success`);
  } else {
    res.error('Error, note failed');
  }
});


app.delete("/api/notes/:id", function (req, res) {
    readAndDelete('./db/db.json', req.params.id);
    res.json(`deletion successful`);
});

app.listen(PORT, () => console.log("listening on port http://localhost:" + PORT))