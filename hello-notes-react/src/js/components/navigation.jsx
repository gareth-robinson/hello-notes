import React from "react";
import { useIntl } from "react-intl";
import constants from "../constants";

const { VIEW } = constants;
const buttonStyle = "h-8 p-1";
const buttonStyleActive = "h-8 p-1 bg-app_light";

const Navigation = props => {
  const intl = useIntl();
  const { newNote, view, onChange } = props;

  return (
    <nav className="w-12 h-full bg-app flex flex-col border-r border-gray-400">
      <button
        title={intl.formatMessage({
          id: "navigation.add",
          defaultMessage: "Add"
        })}
        className={buttonStyle}
        onClick={newNote}
      >
        <i className="material-icons">add</i>
      </button>
      <button
        title={intl.formatMessage({
          id: "navigation.notes",
          defaultMessage: "Notes"
        })}
        className={view === VIEW.ACTIVE ? buttonStyleActive : buttonStyle}
        onClick={() => onChange(VIEW.ACTIVE)}
      >
        <i className="material-icons">description</i>
      </button>
      <button
        title={intl.formatMessage({
          id: "navigation.trash",
          defaultMessage: "Deleted notes"
        })}
        className={view === VIEW.DELETED ? buttonStyleActive : buttonStyle}
        onClick={() => onChange(VIEW.DELETED)}
      >
        <i className="material-icons">delete</i>
      </button>
      <button
        title={intl.formatMessage({
          id: "navigation.categories",
          defaultMessage: "Categories"
        })}
        className={view === VIEW.CATEGORIES ? buttonStyleActive : buttonStyle}
        onClick={() => onChange(VIEW.CATEGORIES)}
      >
        <i className="material-icons">turned_in</i>
      </button>
    </nav>
  );
};

export default Navigation;
