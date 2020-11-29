import React, { useReducer, useState, useEffect } from "react";
import Navigation from "./components/navigation";
import NoteList from "./components/note-list";
import NoteViewer from "./components/note-viewer";
import uuid from "uuid";
import constants from "./constants";

const { VIEW } = constants;

const createDraft = () => ({
  id: uuid(),
  date: new Date().getTime(),
  title: "New note",
  body: "",
  isNew: true
});

function notesReducer(state, action) {
  const { notes, current } = state;
  switch (action.type) {
    case "initialise":
      return {
        notes: action.data,
        current: action.data && action.data[0]
      };
    case "createDraft":
      const newNote = createDraft();
      return {
        ...state,
        current: newNote
      };
    case "addNote":
      const newNotes = [].concat(state.notes).concat(action.data);
      return {
        notes: newNotes,
        current: action.data
      };
    case "replaceNote":
      const noteIndex = notes.findIndex(x => x.id === action.data.id);
      const updatedNotes = [].concat(state.notes);
      updatedNotes[noteIndex] = action.data;
      return {
        ...state,
        notes: updatedNotes,
        current: action.data
      };
    case "deleteNote":
      return {
        notes: notes.filter(x => x.id !== state.current.id),
        current: null
      };
    case "selectNote":
      return {
        ...state,
        current: notes.find(x => x.id === action.id)
      };
    default:
      return state;
  }
}

const App = () => {
  const [state, notesDispatch] = useReducer(notesReducer, []);
  const [view, setView] = useState(VIEW.ACTIVE);
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    const opts = {
      headers: {
        accept: "application/json"
      }
    };
    fetch(constants.SERVER_ROOT, opts)
      .then(response => response.json())
      .then(data => notesDispatch({ type: "initialise", data }));
  }, []);

  const selectNote = id => {
    notesDispatch({ type: "selectNote", id });
  };

  const createDraft = () => {
    notesDispatch({ type: "createDraft" });
    setEditing(true);
  };

  const createNote = note => {
    const opts = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json"
      },
      body: JSON.stringify(note)
    };
    fetch(constants.SERVER_ROOT + `/`, opts)
      .then(response => response.json())
      .then(data => notesDispatch({ type: "addNote", data }));
    setEditing(false);
  };

  const saveNote = note => {
    const opts = {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "content-type": "application/json"
      },
      body: JSON.stringify(note)
    };
    fetch(constants.SERVER_ROOT + `/${note.id}`, opts)
      .then(response => response.json())
      .then(data => notesDispatch({ type: "replaceNote", data }));
    setEditing(false);
  };

  const deleteNote = () => {
    const { id, folder } = state.current;
    if (folder === VIEW.DELETED) {
      const opts = {
        method: "DELETE"
      };
      setEditing(false);
      fetch(constants.SERVER_ROOT + `/${id}`, opts).then(() =>
        notesDispatch({ type: "deleteNote", id })
      );
    } else {
      const opts = {
        method: "PATCH",
        headers: {
          accept: "application/json",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          id,
          folder: VIEW.DELETED
        })
      };
      setEditing(false);
      fetch(constants.SERVER_ROOT + `/${id}`, opts)
        .then(response => response.json())
        .then(data => notesDispatch({ type: "replaceNote", data }));
    }
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const restoreNote = () => {
    notesDispatch({ type: "restoreNote" });
  };

  const currentNotes = (state.notes || [])
    .filter(n => n.folder === view)
    .sort((a, b) => b.date - a.date);

  return (
    <>
      <Navigation
        newNote={createDraft}
        view={view}
        onChange={change => setView(change)}
      />
      <NoteList
        notes={currentNotes}
        view={view}
        openNote={id => selectNote(id)}
      />
      <NoteViewer
        note={state.current}
        isEditing={isEditing}
        deleteNote={deleteNote}
        editNote={() => setEditing(true)}
        saveNote={note => (note.isNew ? saveNote(note) : createNote(note))}
        restoreNote={restoreNote}
        cancelEdit={cancelEdit}
      />
    </>
  );
};

export default App;
