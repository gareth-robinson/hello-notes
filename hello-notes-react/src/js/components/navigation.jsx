import React from "react";
import constants from "../constants";
const { VIEW } = constants;

const Navigation = props => {
  const { newNote, view, onChange } = props;

  return (
    <nav className="w-12 h-full bg-app flex flex-col border-r border-gray-400">
      <button title="Add" onClick={newNote}>
        <i className="material-icons">add</i>
      </button>
      <button
        title="Notes"
        className={view === VIEW.ACTIVE ? "bg-app_light" : ""}
        onClick={() => onChange(VIEW.ACTIVE)}
      >
        <i className="material-icons">description</i>
      </button>
      <button
        title="Trash"
        className={view === VIEW.DELETED ? "bg-app_light" : ""}
        onClick={() => onChange(VIEW.DELETED)}
      >
        <i className="material-icons">delete</i>
      </button>
    </nav>
  );
};

export default Navigation;
