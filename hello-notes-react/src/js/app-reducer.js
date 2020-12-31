function appReducer(state, action) {
  const { notes, current } = state;
  switch (action.type) {
    case "initialise":
      return {
        notes: action.data,
        current: action.data && action.data[0]
      };
    case "addNote":
      const newNotes = [].concat(action.data).concat(state.notes);
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
        current: notes.find(x => x.id === action.id) || { noMatch: true }
      };
    default:
      return state;
  }
}

export default appReducer;
