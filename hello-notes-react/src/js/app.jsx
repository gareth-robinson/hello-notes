import React, { useReducer, useState, useEffect } from "react";
import Navigation from "./components/navigation";
import NoteList from "./components/note-list";
import NoteViewer from "./components/note-viewer";
import appReducer from "./app-reducer";
import constants from "./constants";
import initialise from "./actions/initialise";

const { VIEW } = constants;

const App = () => {
  const [notesState, notesDispatch] = useReducer(appReducer, []);
  const [searchResults, setSearchResults] = useState(false);
  const [view, setView] = useState(VIEW.ACTIVE);
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    initialise(data => notesDispatch({ type: "initialise", data }));
  }, []);

  const selectNote = id => {
    notesDispatch({ type: "selectNote", id });
  };

  const createDraft = () => {
    notesDispatch({ type: "createDraft" });
    setEditing(true);
  };

  const createNote = note => {
    if (!note.title) {
      note.title = "Note title";
    }
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
    const { id, folder } = notesState.current;
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
    const { id } = notesState.current;
    const opts = {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        id,
        folder: VIEW.ACTIVE
      })
    };
    fetch(constants.SERVER_ROOT + `/${id}`, opts)
      .then(response => response.json())
      .then(data => notesDispatch({ type: "replaceNote", data }));
  };

  const performSearch = query => {
    const opts = {
      headers: {
        accept: "application/json"
      }
    };
    fetch(constants.SERVER_ROOT + `/?search=${encodeURIComponent(query)}`, opts)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data);
        setView(VIEW.SEARCH);
      });
  };

  const clearSearch = () => {
    setSearchResults(false);
    setView(VIEW.ACTIVE);
  };

  const currentNotes = (notesState.notes || [])
    .filter(n => n.folder === view)
    .sort((a, b) => b.date - a.date);

  return (
    <>
      <Navigation
        newNote={createDraft}
        view={view}
        onChange={change => {
          setSearchResults(false);
          setView(change);
        }}
      />
      <NoteList
        notes={searchResults || currentNotes}
        selected={notesState.current}
        view={view}
        openNote={id => selectNote(id)}
        hasSearch={!!searchResults}
        performSearch={performSearch}
        clearSearch={clearSearch}
      />
      <NoteViewer
        note={notesState.current}
        isEditing={isEditing}
        deleteNote={deleteNote}
        editNote={() => setEditing(true)}
        saveNote={note => {
          note.isNew ? createNote(note) : saveNote(note);
        }}
        restoreNote={restoreNote}
        cancelEdit={cancelEdit}
      />
    </>
  );
};

export default App;
