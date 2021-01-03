import React from "react";
import { useIntl } from "react-intl";
import SearchBar from "./search-bar";
import constants from "../constants";
import { categoryToBackgroundColour } from "../utils/category-as-style";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const { VIEW } = constants;

const NoteList = props => {
  const intl = useIntl();
  const {
    notes = [],
    view,
    openNote,
    selected,
    hasSearch,
    performSearch,
    clearSearch
  } = props;

  let title;
  switch (view) {
    case VIEW.ACTIVE:
      title = intl.formatMessage({
        id: "navigation.notes",
        defaultMessage: "Notes"
      });
      break;
    case VIEW.DELETED:
      title = intl.formatMessage({
        id: "navigation.trash",
        defaultMessage: "Deleted notes"
      });
      break;
    case VIEW.DELETED:
      title = intl.formatMessage({
        id: "navigation.search-results",
        defaultMessage: "Search results"
      });
      break;
  }

  function renderNote(note) {
    const { id, title, synopsis, date, category } = note;
    const border =
      selected && selected.id === id ? "border-green-300" : "border-gray-400";
    const categoryStyle = categoryToBackgroundColour(category);
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
      <div className="border-b h-8 p-1 bg-white">{title}</div>
      <SearchBar
        performSearch={performSearch}
        clearSearch={clearSearch}
        hasSearch={hasSearch}
      />
      <div className="overflow-y-scroll">{notes.map(renderNote)}</div>
    </div>
  );
};

export default NoteList;
