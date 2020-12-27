import uuid from "uuid";

function appReducer(state, action) {
  const { notes, current } = state;
  switch (action.type) {
    case "initialise":
      return {
        notes: action.data,
        current: action.data && action.data[0]
      };
    case "createDraft":
      const newNote = {
        id: uuid(),
        date: new Date().getTime(),
        title: "New note",
        body: "",
        isNew: true
      };
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

export default appReducer;
