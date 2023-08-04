document.addEventListener("click", async (event) => {
  if(event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;
    remove(id).then(() => {
      event.target.closest("li").remove();
    });
  }
  if(event.target.dataset.type === "edit") {
    handleEdit(event);
  }
})

function handleEdit(event) {
  const id = event.target.dataset.id;
  const editButton = event.target;
  const deleteNoteButton = editButton.nextElementSibling;
  const titleSpanElement = event.target.closest("li").firstElementChild;
  const buttonsContainer = editButton.closest("span");

  const inputElement = document.createElement("input");
  const saveButton = document.createElement("button");
  const cancelButton = document.createElement("button");

  editButton.style.display = "none";
  deleteNoteButton.style.display = "none";

  saveButton.className = "btn btn-success";
  saveButton.innerText = "Save";
  editButton.closest("span").insertAdjacentElement("afterbegin", saveButton);

  cancelButton.className = "btn btn-danger";
  cancelButton.innerText = "Cancel";
  buttonsContainer.insertAdjacentElement("beforeend", cancelButton);
  cancelButton.addEventListener("click", () => {
    cancelButton.remove();
    saveButton.remove();
    editButton.style.display = "inline-block";
    deleteNoteButton.style.display = "inline-block";
    inputElement.replaceWith(titleSpanElement);
  });

  inputElement.value = titleSpanElement.innerText;
  titleSpanElement.replaceWith(inputElement);

  saveButton.addEventListener("click", async (e) => {
    const newTitle = inputElement.value;
    if (!newTitle) {
      alert("Title cannot be empty");
      return
    };
    edit({ id, title: newTitle }).then(() => {
      titleSpanElement.innerText = newTitle
      inputElement.replaceWith(titleSpanElement);
      cancelButton.remove();
      saveButton.remove();
      editButton.style.display = "inline-block";
      deleteNoteButton.style.display = "inline-block";
      alert("Title updated");
    });
  });
};

function alert(status) {
  const notificationDiv = document.createElement("div");
  const notificationText = status;

  const classList = `alert ${status === "Title updated" ? "alert-success" : "alert-warning"}`

  notificationDiv.className = classList;
  notificationDiv.innerText = notificationText;

  const container = document.getElementsByClassName("container");

  container[0].insertAdjacentElement("afterbegin", notificationDiv);
  setTimeout(() => {
    notificationDiv.remove();
  }, 1500);
}

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