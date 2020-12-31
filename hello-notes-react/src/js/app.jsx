import React, { useReducer, useState, useEffect } from "react";
import { createBrowserHistory } from "history";
import Navigation from "./components/navigation";
import NoteList from "./components/note-list";
import NoteViewer from "./components/note-viewer";
import appReducer from "./app-reducer";
import constants from "./constants";
import initialise from "./actions/initialise";
import { createNoteAction, updateNoteAction, deleteNoteAction, performSearchAction } from "./actions";

const { VIEW } = constants;
const history = createBrowserHistory();

const App = () => {
  const [notesState, notesDispatch] = useReducer(appReducer, []);
  const [searchResults, setSearchResults] = useState(false);
  const [view, setView] = useState(VIEW.ACTIVE);
  const [isEditing, setEditing] = useState(false);

  const selectFromPath = pathname => {
    const id = /\/(.*)/.exec(pathname);
    if (id[1]) {
      notesDispatch({ type: "selectNote", id: id[1] });
    }
  };

  useEffect(async () => {
    const data = await initialise();
    notesDispatch({ type: "initialise", data })
    history.listen(({ action, location }) => {
      if (action === "POP") {
        selectFromPath(location.pathname);
      }
    });
  }, []);

  useEffect(() => {
    if (notesState.notes) {
      selectFromPath(window.location.pathname);
    }
  }, [!!notesState.notes]);

  const selectNote = id => {
    notesDispatch({ type: "selectNote", id });
    history.push("/" + id);
  };

  const createNewNote = async () => {
    const note = { title: "New note" };
    const data = await createNoteAction(note);
    notesDispatch({ type: "addNote", data });
    setEditing(true);
    history.push("/" + data.id);
  };

  const saveNote = async note => {
    const data = await updateNoteAction(note);
    notesDispatch({ type: "replaceNote", data });
    setEditing(false);
  };

  const deleteNote = async () => {
    const note = notesState.current;
    const { id, folder } = note;
    if (folder === VIEW.DELETED) {
      await deleteNoteAction(note);
      notesDispatch({ type: "deleteNote", id })
      setEditing(false);
    } else {
      const update = {
        id,
        folder: VIEW.DELETED
      };
      const data = await updateNoteAction(update);
      notesDispatch({ type: "replaceNote", data });
      setEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const restoreNote = async () => {
    const note = notesState.current;
    const update = {
      id: note.id,
      folder: VIEW.ACTIVE
    };
    const data = await updateNoteAction(update);
    notesDispatch({ type: "replaceNote", data });
  };

  const performSearch = async query => {
    const data = await performSearchAction(query);
    setSearchResults(data);
    setView(VIEW.SEARCH);
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
        newNote={createNewNote}
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
        saveNote={saveNote}
        restoreNote={restoreNote}
        cancelEdit={cancelEdit}
      />
    </>
  );
};

export default App;
