import React from 'react';

const Navigation = props => {
  const {
    newNote,
    view,
    onChange
  } = props;

  return (
    <nav className="w-12 h-full bg-app flex flex-col border-r border-gray-400">
      <button
        title="Add"
        onClick={newNote}>
        <i className="material-icons">add</i>
      </button>
      <button
        title="Notes"
        className={view === "notes" ? "bg-app_light" : ""}
        onClick={() => onChange("notes")}>
        <i className="material-icons">description</i>
      </button>
      <button
        title="Trash"
        className={view === "deleted" ? "bg-app_light" : ""}
        onClick={() => onChange("deleted")}>
        <i className="material-icons">delete</i>
      </button>
    </nav>
  );
}

export default Navigation;