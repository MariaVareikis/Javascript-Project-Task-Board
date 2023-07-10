// Get element references:
const dateElement = document.getElementById("date");
const textareaElement = document.getElementById("textarea");
const timeElement = document.getElementById("time");
const notesElement = document.getElementById("notes");

// Initialize notes array:
let notesArray = [];

// Load notes from local storage and display them:
getFromLocalStorageAndDisplayNotes();

// Set a minimum date for the date input field:
limitDateInput();

// Function to limit the date input to the current date and future dates:
function limitDateInput() {
    // Get the current date:
    let today = new Date();

    // Format the date as YYYY-MM-DD:
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let formattedDate = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;

    // Set the minimum date attribute of the date input field:
    document.getElementById("date").setAttribute("min", formattedDate);
}

// Function to clear the input fields and background colors:
function removeText() {
    dateElement.value = "";
    textareaElement.value = "";
    timeElement.value = "";
    dateElement.style.backgroundColor = "";
    textareaElement.style.backgroundColor = "";
    timeElement.style.backgroundColor = "";
}

// Function to delete a note:
function deleteNote(button) {
    // Get the parent elements:
    let buttonElement = button.parentElement;
    let noteDiv = buttonElement.parentElement;

    // Get the ID of the note div:
    let noteDivId = +noteDiv.id;

    // Remove the note from the notes array:
    notesArray.splice(noteDivId, 1);

    // Clear the notes element:
    notesElement.innerHTML = "";

    // Re-create the notes from the updated notes array:
    for (let i = 0; i < notesArray.length; i++) {
        createNote(notesArray[i].textarea, notesArray[i].date, notesArray[i].time, i);
    }

    // Save the updated notes array to local storage:
    saveToLocalStorage();

}

// Function to add a note to the notes array and display it:
function addNoteToArray(textarea, date, time) {

    let newNote = {
        textarea,
        date,
        time
    };

    notesArray.push(newNote);

}

// Function to handle the add note button click:
function onAddNoteClicked() {

    let textarea = textareaElement.value;
    let date = dateElement.value;
    let time = timeElement.value;
    let isValid = validateFields(textarea, date, time);

    // Clear previous errors:
    clearErrors();

    try {
        if (!isValid) {
            return;
        }

        // Create the note and add it to the notes array:
        createNote(textarea, date, time, notesArray.length);
        addNoteToArray(textarea, date, time);

        // Save the updated notes array to local storage:
        saveToLocalStorage();
    } catch (e) {
        alert(e.message);
    }
}

// Function to validate the input fields:
function validateFields(textarea, date, time) {
    // Clear previous input background colors:
    clearInputBackgroundColors();

    if (!textarea) {
        swal("Error!", "Text area can not be empty!", "error");
        textareaElement.style.backgroundColor = "pink";
        return false;
    }

    if (textarea.trim() == "") {
        swal("Error!", "Text area can not contain only spaces!", "error");
        textareaElement.style.backgroundColor = "pink";
        return false;
    }

    if (!time) {
        swal("Error!", "Please enter a time!", "error");
        timeElement.style.backgroundColor = "pink";
        return false;
    }

    if (!date) {
        swal("Error!", "Please enter a date!", "error");
        dateElement.style.backgroundColor = "pink";
        return false;
    }

    let now = new Date();

    if (new Date(date) < now) {
        swal("Error!", "Please enter a date in the future!", "error");
        dateElement.style.backgroundColor = "pink";
        return false;
    }

    return true;
    
}

// Function to clear the input field background colors:
function clearInputBackgroundColors() {

    const inputs = [textareaElement, timeElement, dateElement];
    inputs.forEach((input) => {
        input.style.backgroundColor = "";
    });

}

// Function to clear previous errors:
function clearErrors() {

    textareaElement.style.border = "";
    timeElement.style.border = "";
    dateElement.style.border = "";
    textareaElement.focus();

}

// Function to create a new note element:
function createNote(textarea, date, time, noteId) {

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

// Function to save the notes array to local storage:
function saveToLocalStorage() {
    localStorage.setItem("saveNotes", JSON.stringify(notesArray));
}

// Function to retrieve notes from local storage and display them:
function getFromLocalStorageAndDisplayNotes() {

    let notesArrayFromLocalStorage = JSON.parse(localStorage.getItem("saveNotes"));

    if (notesArrayFromLocalStorage != null) {
        notesArray = notesArrayFromLocalStorage;

        for (let i = 0; i < notesArray.length; i++) {
            createNote(notesArray[i].textarea, notesArray[i].date, notesArray[i].time, i);
        }
    }

}
