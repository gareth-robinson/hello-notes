import React from "react";

const NoNote = props => {
  const { note, newNote } = props;
  if (note && note.noMatch) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-xs pb-2">
          Note has not been found. It may have been deleted.
        </div>
        <div className="text-xs">
          <button
            title="Add"
            className="border border-gray-400 rounded-sm p-1"
            onClick={newNote}
          >
            <i className="material-icons align-middle">add</i>
            <span className="leading-6 align-middle">Add note</span>
          </button>
        </div>
      </div>
    );
  }
  return <div className="flex-1"></div>;
};

export default NoNote;
