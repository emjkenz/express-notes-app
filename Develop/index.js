const express = require('express');
const app = express();
const fs = require('fs');
const crypto = require('crypto');

// Add support for serving assets
app.use(express.static('public'));
// Added support for json returns
app.use(express.json());

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

const writeNotes = (notes) => {
    try {
        fs.writeFileSync(database, JSON.stringify(notes, null, 2));
    } catch (err) {
        console.error(err);
    }
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

app.post('/api/notes', (req, res) => {
    const notes = readNotes();

    // Use crypto to generate unique id for the note
    const newNote = {
        id: crypto.randomUUID(),
        title: req.body.title,
        text: req.body.text,
    };

    notes.push(newNote);
    writeNotes(notes);
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const notes = readNotes();
    const noteId = req.params.id;

    // Filter existing notes for notes that dont have requested :id
    const updatedNotes = notes.filter(note => note.id !== noteId);

    if (updatedNotes.length !== notes.length) {
        writeNotes(updatedNotes);
        res.json({ success: true, message: 'Note deleted successfully.' });
    } else {
        res.status(404).json({ success: false, message: 'Note not found.' });
    }
})

app.listen(3000)