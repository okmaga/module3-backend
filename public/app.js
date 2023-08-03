document.addEventListener("click", async (event) => {
  if(event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;
    remove(id).then(() => {
      event.target.closest("li").remove();
    });
  }
  if(event.target.dataset.type === "edit") {
    const id = event.target.dataset.id;
    const noteTitle = event.target.closest("li").firstElementChild.textContent;
    const newNoteTitle = prompt("Enter new note name", `${ noteTitle }`);
    edit({ id, title: newNoteTitle }).then(() => {
      event.target.closest("li").firstElementChild.innerText =  newNoteTitle;
    })
  }
})

async function remove(id) {
  await fetch(`/${id}`,{ method: "DELETE" });
}

async function edit(newNote) {
  await fetch(`/${newNote.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newNote)
  });
}