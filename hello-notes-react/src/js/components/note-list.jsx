import React from 'react';
import constants from '../constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const { VIEW } = constants;

const NoteList = props => {
  const {notes = [], view, openNote} = props;

  function renderNote(note) {
    const {id, title, synopsis, date } = note;
    return (
      <a className="block bg-white border border-gray-400 rounded-sm my-1 p-1"
        id={id}
        key={id}
        title={title}
        onClick={() => openNote(id)}>
        <div className="h-8 truncate">{title}</div>
        <div className="text-xs">{synopsis}</div>
        <div className="text-xs">{dayjs(date).fromNow()}</div>
      </a>
    );
  }

  return (
    <div className="w-64 border-r border-gray-400">
      <div className="border-b h-8">
        { view === VIEW.ACTIVE ? "Notes" : "Deleted" }
      </div>
      <div className="border-b">
        <input name="search"/>
      </div>
      <div className="h-full bg-gray-200 p-1">
        { notes.map(renderNote) }
      </div>
    </div>
  );
}

export default NoteList;