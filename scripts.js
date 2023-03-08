const dateElement = document.getElementById("date");
const textareaElement = document.getElementById("textarea");
const timeElement = document.getElementById("time");
const notesElement = document.getElementById("notes");
let notesArray = [];

getFromLocalStorageAndDisplayNotes();

limitDateInput();

function limitDateInput() {
    let today = new Date();

    let month = today.getMonth() + 1;
    let day = today.getDate();
    let year = today.getFullYear();

    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    today = year + "-" + month + "-" + day;

    document.getElementById("date").setAttribute("min", today);
}

function removeText() {
    dateElement.value = "";
    textareaElement.value = "";
    timeElement.value = "";
    dateElement.style.border = "";
    textareaElement.style.border = "";
    timeElement.style.border = "";
}
function deleteNote(button) {
    let buttonElement = button.parentElement;
    let noteDiv = buttonElement.parentElement;

    let noteDivId = +noteDiv.id;
    notesArray.splice(noteDivId, 1);
    notesElement.innerHTML = "";

    for (let i = 0; i < notesArray.length; i++) {
        createNote(notesArray[i].textarea, notesArray[i].date, notesArray[i].time, i);
    }
    saveToLocalStorage();
}

function addNoteToArray(textarea, date, time) {
    let newNote = {
        textarea,
        date,
        time
    }
    notesArray.push(newNote);
}

function onAddNoteClicked() {
    let textarea = textareaElement.value;
    let date = dateElement.value;
    let time = timeElement.value;

    clearErrors();

    try {
        validateFields(textarea, date, time);
        createNote(textarea, date, time, notesArray.length);
        addNoteToArray(textarea, date, time);
        saveToLocalStorage();
    }
    catch (e) {
        alert(e.message);
    }

}
function validateFields(textarea, date, time) {
    let errorMessage = "";
    if (!textarea) {
        errorMessage = errorMessage + "Text area can not be empty!\n";
        textareaElement.style.border = "3px solid red";

    }
    else if (textarea.trim() == "") {
        errorMessage = errorMessage + "Text area can not contain only spaces!\n";
        textareaElement.style.border = "3px solid red";
    }
    if (!time) {
        errorMessage = errorMessage + "Please enter a time!\n";
        timeElement.style.border = "3px solid red";
    }
    if (!date) {
        errorMessage = errorMessage + "Please enter a date!";
        dateElement.style.border = "3px solid red";
    }
    let now = new Date();
    if (new Date(date) < now) {
        errorMessage = errorMessage + "Please enter a date in future!";
        dateElement.style.border = "3px solid red";
    }
    if (errorMessage != "") {
        throw new Error(errorMessage);
    }
}

function clearErrors() {
    textareaElement.style.border = "";
    timeElement.style.border = "";
    dateElement.style.border = "";
}

function createNote(textarea, time, date, noteId) {
    let noteDiv = document.createElement("div");
    noteDiv.setAttribute("class", "note");
    noteDiv.setAttribute("id", noteId);

    let textAreaSpan = document.createElement("span");
    textAreaSpan.setAttribute("class", "noteTextArea");

    let dateSpan = document.createElement("span");
    dateSpan.setAttribute("class", "noteDate");

    let timeSpan = document.createElement("span");
    timeSpan.setAttribute("class", "noteTime");

    let button = document.createElement("button");
    button.setAttribute("class", "delete");
    button.setAttribute("onclick", "deleteNote(this)");

    let buttonElement = document.createElement("span");
    buttonElement.setAttribute("class", "button-element");
    buttonElement.setAttribute("aria-hidden", "true");

    textAreaSpan.innerHTML = textarea.trim();
    timeSpan.innerHTML = time;
    dateSpan.innerHTML = date;

    noteDiv.appendChild(textAreaSpan);
    noteDiv.appendChild(dateSpan);
    noteDiv.appendChild(timeSpan);
    buttonElement.appendChild(button);
    noteDiv.appendChild(buttonElement);

    notesElement.appendChild(noteDiv);
}

function saveToLocalStorage() {
    localStorage.setItem("saveNotes", JSON.stringify(notesArray));

}
function getFromLocalStorageAndDisplayNotes() {
    let notesArrayFromLocalStorage = JSON.parse(localStorage.getItem("saveNotes"));
    if (notesArrayFromLocalStorage != null) {
        notesArray = notesArrayFromLocalStorage;
        for (let i = 0; i < notesArray.length; i++) {
            createNote(notesArray[i].textarea, notesArray[i].date, notesArray[i].time, i);
        }
    }
}

