import React, {useReducer, useState, useEffect} from 'react';
import Navigation from './components/navigation';
import NoteList from './components/note-list';
import NoteViewer from './components/note-viewer';
import uuid from 'uuid';
import initialState from './initial-state';
initialState.current = initialState.notes[0];

const createDraft = () => ({
  id: uuid(),
  title: "New note",
  body: ""
});

function notesReducer(state, action) {
  const { notes, deleted } = state;
  switch (action.type) {
    case 'addNote':
      const newNote = createDraft();
      return {
        ...state,
        current: newNote
      };
    case 'deleteNote':
      return {
        notes: notes.filter(x => x.id !== state.current.id),
        deleted: [notes.find(x => x.id === state.current.id)]
          .concat(deleted),
        current: null,
      };
    case 'replaceNote':
      const noteIndex = notes.findIndex(x => x.id === action.note.id);
      let newNotes;
      if (noteIndex < 0) {
        newNotes = [action.note].concat(notes);
      } else {
        newNotes = [action.note]
          .concat(notes.slice(0, noteIndex))
          .concat(notes.slice(noteIndex + 1));
      }
      return {
        ...state,
        notes: newNotes,
        current: action.note
      };
    case 'selectNote':
      const current = notes.find(x => x.id === action.id) ||
        deleted.find(x => x.id === action.id);
      return {
        ...state,
        current
      };
    default:
      return state;
  }
}

const App = () => {
  const [state, notesDispatch] = useReducer(notesReducer, initialState);
  const [view, setView] = useState("notes");
  const [isEditing, setEditing] = useState(false);

  const deleteNote = () => {
    notesDispatch({type: 'deleteNote'});
    setEditing(false);
  }
  const addNote = () => {
    notesDispatch({type: 'addNote'});
    setEditing(true);
  }
  const saveNote = note => {
    notesDispatch({type: 'replaceNote', note});
    setEditing(false);
  }
  const cancelEdit = () => {
    setEditing(false);
  }
  const selectNote = id => {
    notesDispatch({type: 'selectNote', id});
  }
  const currentNotes = view === "deleted"
    ? state.deleted
    : state.notes;

  console.log("what???", currentNotes)

  return (
    <>
      <Navigation
        newNote={addNote}
        view={view}
        onChange={change => setView(change)}
      />
      <NoteList
        notes={currentNotes}
        openNote={id => selectNote(id)}
      />
      <NoteViewer
        note={state.current}
        isEditing={isEditing}
        deleteNote={deleteNote}
        editNote={() => setEditing(true)}
        saveNote={note => saveNote(note)}
        cancelEdit={cancelEdit}
      />
    </>
  );
};

export default App;
