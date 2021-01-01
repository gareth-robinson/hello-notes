import cloneDeep from "clone-deep";

function noteReducer(state, action) {
  switch (action.type) {
    case "initialise":
      return action.data ? cloneDeep(action.data) : {};
    case "setBody":
      return {
        ...state,
        content: action.data
      };
    case "setCategory":
      return {
        ...state,
        category: action.data
      };
    case "setTitle":
      return {
        ...state,
        title: action.data
      };
    default:
      return state;
  }
}

export default noteReducer;
