const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const { v4: uuidv4 } = require('uuid');;
const { readFromFile, readAndAppend, readAndDelete } = require('./routes/readWrite');
const htmlroutes = require("./routes/htmlroutes")
// Middleware
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

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

app.use("/",htmlroutes)


app.listen(PORT, () => console.log("listening on port http://localhost:" + PORT))