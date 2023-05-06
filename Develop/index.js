const express = require('express');
const app = express();
const fs = require('fs');

// Add support for serving assets
app.use(express.static('public'));

const databaseDir = "db/";
const database = databaseDir+"db.json";

// Read the notes from the database
const readNotes = () => {
    let data = [];

    if (fs.existsSync(database)) {
        // Read the file if it exists
        const jsonData = fs.readFileSync(database);
        data = JSON.parse(jsonData);
    }
    else {
        fs.mkdirSync(databaseDir, { recursive: true });
    }

    return data;
};

// Show the notes homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Show the notes editor
app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
});

// Show json data from db.json
app.get('/api/notes', (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

app.listen(3000)