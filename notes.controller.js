const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");
async function addNote(title) {
  const notes = await getNotes();

  const note = {
    title,
    id: Date.now().toString()
  };

  notes.push(note);

  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(chalk.bgGreen("Note was added"));
};
async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8"});
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
};

async function printNotes() {
  const notes = await getNotes();
  console.log(chalk.bgBlue("Here is the list of notes"));
  notes.forEach(note  => {
    console.log(chalk.blue(`${note.id} ${note.title}`));
  })
};

async function removeNote(id) {
  const notes = await getNotes();

  const newNotes = notes.filter(note => note.id !== id.toString());

  await fs.writeFile(notesPath, JSON.stringify(newNotes));
  console.log(chalk.bgRed(`Note ${id} was removed`));
}

async function editNote(newNote) {
  const notes = await getNotes();

  const newNotes = notes.map(note => note.id === newNote.id.toString()
    ? newNote
    : note);

  await fs.writeFile(notesPath, JSON.stringify(newNotes));
  console.log(chalk.bgBlue(`Note ${newNote.id} was updated`));
}

async function editNoteById(id, newTitle) {
  const notes = await getNotes();

  const newNotes = notes.map(note => note.id === id.toString()
    ? { ... note, title: newTitle }
    : note);

  await fs.writeFile(notesPath, JSON.stringify(newNotes));
  console.log(chalk.bgBlue(`Title for note ${id} was changed to ${newTitle}`));
}

module.exports = {
  addNote,
  getNotes,
  removeNote,
  editNote,
  editNoteById,
}