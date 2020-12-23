import React from "react";
import constants from "../constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const { VIEW } = constants;
const categoryStyles = {
  red: "bg-red-400",
  green: "bg-green-400",
  blue: "bg-blue-400"
};

const NoteList = props => {
  const { notes = [], view, openNote, selected } = props;

  function renderNote(note) {
    const { id, title, synopsis, date, category } = note;
    const border = selected.id === id ? "border-green-300" : "border-gray-400";
    const categoryStyle = categoryStyles[category] || "bg-white";
    const day = dayjs(date);

    return (
      <a
        className="block m-1"
        id={id}
        key={id}
        title={title}
        onClick={() => openNote(id)}
      >
        <div
          className={`bg-white border rounded-sm ${border} cursor-pointer flex`}
        >
          <div className={`w-2 ${categoryStyle}`}></div>
          <div className="w-full_minus2 p-1">
            <div className="pb-1 truncate">{title}</div>
            <div className="text-xs h-8 overflow-hidden">{synopsis}</div>
            <div
              className="pt-1 text-xs text-right"
              title={day.format("DD/MM/YYYY HH:mm:ss")}
            >
              {day.fromNow()}
            </div>
          </div>
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
