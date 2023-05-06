const express = require('express');
const app = express();
const fs = require('fs');

// Add support for serving assets
app.use(express.static('public'));

const database = "db/db.json"

// Show the notes homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Show the notes editor
app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
});

app.listen(3000)