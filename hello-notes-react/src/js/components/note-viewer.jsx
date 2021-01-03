import React, { useEffect, useReducer, useState } from "react";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import CategoryChooser from "./category-chooser";
import CategoryIcon from "./category-icon";
import NoteEditor from "./note-editor";
import noteReducer from "./note-viewer-reducer";
import PopUp from "./popup";
import constants from "../constants";

const { VIEW } = constants;
const titleRef = React.createRef();
const buttons = defineMessages({
  "note-viewer.restore": {
    id: "note-viewer.restore",
    defaultMessage: "Restore"
  },
  "note-viewer.cancel": {
    id: "note-viewer.cancel",
    defaultMessage: "Cancel changes"
  },
  "note-viewer.delete": {
    id: "note-viewer.delete",
    defaultMessage: "Delete note"
  },
  "note-viewer.edit": {
    id: "note-viewer.edit",
    defaultMessage: "Edit"
  },
  "note-viewer.save": {
    id: "note-viewer.save",
    defaultMessage: "Save"
  }
});

const NoteViewer = props => {
  const [state, noteDispatch] = useReducer(noteReducer, {});
  const purgeState = useState(false);
  const intl = useIntl();
  const [purge, setPurge] = purgeState;
  const {
    note,
    cancelEdit,
    editNote,
    deleteNote,
    restoreNote,
    saveNote,
    isEditing
  } = props;

  useEffect(() => {
    noteDispatch({ type: "initialise", data: note });
  }, [note && note.id]);

  const makeButton = (messageId, icon, onClick) => {
    const { defaultMessage } = buttons[messageId];
    return (
      <button
        title={intl.formatMessage({ id: messageId, defaultMessage })}
        onClick={onClick}
      >
        <i className="material-icons">{icon}</i>
      </button>
    );
  };

  const deleteAction = () => {
    if (note.folder === VIEW.DELETED && !purge) {
      setPurge(true);
    } else {
      deleteNote();
      setPurge(false);
    }
  };

  const saveAction = () => {
    const newVersion = {
      id: note.id,
      title: titleRef.current.value,
      content: state.content,
      category: state.category
    };
    saveNote(newVersion);
  };

  const restoreButton = () =>
    makeButton("note-viewer.restore", "cached", restoreNote);
  const cancelButton = () =>
    makeButton("note-viewer.cancel", "clear", cancelEdit);
  const editButton = () => makeButton("note-viewer.edit", "edit", editNote);
  const saveButton = () => makeButton("note-viewer.save", "done", saveAction);
  const deleteButton = makeButton("note-viewer.delete", "delete", deleteAction);

  const titleArea = isEditing ? (
    <input
      type="text"
      ref={titleRef}
      defaultValue={note.title}
      placeholder={intl.formatMessage({
        id: "note-viewer.title-placeholder",
        defaultMessage: "Note title"
      })}
      className="w-full border border-green-300"
    />
  ) : (
    note.title
  );

  const bodyArea = isEditing ? (
    <NoteEditor
      key={state.id}
      body={state.content}
      setBody={b => noteDispatch({ type: "setBody", data: b })}
    />
  ) : (
    <div
      className="note-viewer text-xs p-3"
      dangerouslySetInnerHTML={{ __html: state.content }}
    />
  );

  const { category } = state || {};
  const actions = (
    <>
      {isEditing ? (
        <CategoryChooser
          category={category}
          onChange={c => noteDispatch({ type: "setCategory", data: c })}
        />
      ) : (
        <CategoryIcon category={category} />
      )}
      {state.folder === VIEW.DELETED
        ? restoreButton()
        : isEditing
        ? saveButton()
        : editButton()}
      {isEditing ? cancelButton() : null}
      {deleteButton}
    </>
  );

  const bodyClass = isEditing
    ? "flex-1 overflow-hidden"
    : "flex-1 overflow-y-scroll";

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-400 flex">
        <div className="flex-grow h-8">{titleArea}</div>
        <div className="actions">{actions}</div>
      </div>
      <div className={bodyClass}>{bodyArea}</div>
      <PopUp
        visible={purge}
        title={intl.formatMessage({
          id: "note-viewer.purge-title",
          defaultMessage: "Delete note"
        })}
        text={intl.formatMessage({
          id: "note-viewer.purge-message",
          defaultMessage:
            "This will permanently delete the note. Do you wish to continue?"
        })}
        onContinue={deleteAction}
        onCancel={() => setPurge(false)}
      />
    </div>
  );
};

export default NoteViewer;
