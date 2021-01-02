import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const NoNote = props => {
  const { note, newNote } = props;
  const intl = useIntl();

  if (note && note.noMatch) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-xs pb-2">
          <FormattedMessage id="no-note.not-found" />
        </div>
        <div className="text-xs">
          <button
            title={intl.formatMessage({ id: "navigation.add" })}
            className="border border-gray-400 rounded-sm p-1"
            onClick={newNote}
          >
            <i className="material-icons align-middle">add</i>
            <span className="leading-6 align-middle">
              {intl.formatMessage({ id: "no-note.add-note" })}
            </span>
          </button>
        </div>
      </div>
    );
  }
  return <div className="flex-1"></div>;
};

export default NoNote;
