import React, {useReducer, useState, useEffect} from 'react';
import Navigation from './components/navigation';
import NoteList from './components/note-list';
import NoteViewer from './components/note-viewer';
import uuid from 'uuid';
import initialState from './initial-state';
import constants from './constants';

initialState.current = initialState.notes[0];
const { VIEW } = constants;

const createDraft = () => ({
  id: uuid(),
  date: new Date().getTime(),
  title: "New note",
  body: ""
});

function notesReducer(state, action) {
  const { notes, deletedNotes } = state;
  switch (action.type) {
    case 'addNote':
      const newNote = createDraft();
      return {
        ...state,
        current: newNote
      };
    case 'deleteNote':
      let deletedNote = notes.find(x => x.id === state.current.id);
      deletedNote = {
        ...deletedNote,
        deleted: true
      };
      return {
        notes: notes.filter(x => x.id !== state.current.id),
        deletedNotes: [deletedNote].concat(deletedNotes),
        current: null,
      };
    case 'restoreNote':
      let { deleted, ...restoredNote } = deletedNotes.find(x => x.id === state.current.id);
      return {
        notes: [restoredNote].concat(notes),
        deletedNotes: deletedNotes.filter(x => x.id !== state.current.id),
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
        deletedNotes.find(x => x.id === action.id);
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
  const [view, setView] = useState(VIEW.ACTIVE);
  const [isEditing, setEditing] = useState(false);

  const selectNote = id => {
    notesDispatch({type: 'selectNote', id});
  }
  const deleteNote = () => {
    if (view === VIEW.DELETED) {
      // TODO Purge!
    } else {
      notesDispatch({type: 'deleteNote'});
    }
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
  const restoreNote = () => {
    notesDispatch({type: 'restoreNote'});
  }
  const currentNotes = view === VIEW.DELETED
    ? state.deletedNotes
    : state.notes;

  return (
    <>
      <Navigation
        newNote={addNote}
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
        saveNote={note => saveNote(note)}
        restoreNote={restoreNote}
        cancelEdit={cancelEdit}
      />
    </>
  );
};

export default App;
