import React from "react";
import constants from "../constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const { VIEW } = constants;

const NoteList = props => {
  const { notes = [], view, openNote, selected } = props;

  function renderNote(note) {
    const { id, title, synopsis, date } = note;
    const border = selected.id === id ? "border-green-300" : "border-gray-400";

    return (
      <a
        className="block m-1"
        id={id}
        key={id}
        title={title}
        onClick={() => openNote(id)}
      >
        <div className={`bg-white border rounded-sm p-1 ${border}`}>
          <div className="h-8 truncate">{title}</div>
          <div className="text-xs">{synopsis}</div>
          <div className="text-xs">{dayjs(date).fromNow()}</div>
        </div>
      </a>
    );
  }

  return (
    <div className="w-64 border-r border-gray-400 flex flex-col bg-gray-100">
      <div className="border-b h-8 bg-white">
        {view === VIEW.ACTIVE ? "Notes" : "Deleted"}
      </div>
      <div className="border-b bg-white">
        <input name="search" />
      </div>
      <div className="overflow-y-scroll">{notes.map(renderNote)}</div>
    </div>
  );
};

export default NoteList;
