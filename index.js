const express = require("express");
const yargs = require("yargs");
const pkg = require("./package.json");
const chalk = require("chalk");
const path = require("path");
const {
  addNote,
  getNotes,
  removeNote,
  editNote,
  editNoteById
} = require("./notes.controller");
yargs.version(pkg.version);

const port = 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.json({
  type: "application/json"
}));

app.use(express.static(path.resolve(__dirname, "public")));

app.use(express.urlencoded({
  extended: true
}));


app.get("/", async (req, res) => {
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false
  });
});

app.delete("/:id", async (req, res) => {
  await removeNote(req.params.id);
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false
  });
});

app.put("/:id", async (req, res) => {
  await editNote(req.body);
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: false
  });
})
app.post("/", async (req, res) => {
  await addNote(req.body.title);
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    created: true
  });
});

// app.listen(port, () => {
//   console.log(chalk.green(`Server has been started on port ${port}...`));
// });

yargs.command({
  command: "edit",
  describe: "Edit note by id",
  async handler({ id, title }) {
    await editNoteById(id, title);
  }
});

yargs.parse();