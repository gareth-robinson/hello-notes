import React, { createContext, useReducer } from "react";
import initialCategoryState from "./initial-category-state";

const CategoryStateContext = createContext();
const CategoryDispatchContext = createContext();

function categoryReducer(state, action) {
  switch (action.type) {
    case "disable": {
      const change = {
        [action.id]: {
          ...state[action.id],
          enabled: false
        }
      };
      return {
        ...state,
        change
      };
    }

    case "enable": {
      const change = {
        [action.id]: {
          ...state[action.id],
          enabled: true
        }
      };
      return {
        ...state,
        change
      };
    }
  }
}

function CategoryProvider({ children }) {
  const [state, dispatch] = useReducer(categoryReducer, initialCategoryState);
  return (
    <CategoryStateContext.Provider value={state}>
      <CategoryDispatchContext.Provider value={dispatch}>
        {children}
      </CategoryDispatchContext.Provider>
    </CategoryStateContext.Provider>
  );
}

function useCategoryState() {
  return React.useContext(CategoryStateContext);
}

function useCategoryDispatch() {
  return React.useContext(CategoryDispatchContext);
}

function useCategory() {
  return [useCategoryState(), useCategoryDispatch()];
}

export { CategoryProvider, useCategory };
