import React, { useState } from "react";
import NoteEditor from "./note-editor";
import PopUp from "./popup";
import constants from "../constants";
const { VIEW } = constants;

const titleRef = React.createRef();

const titleArea = props => {
  const { note, isEditing } = props;
  return isEditing ? (
    <input
      type="text"
      ref={titleRef}
      defaultValue={note.title}
      className="w-full border border-green-300"
    />
  ) : (
    note.title
  );
};

const bodyArea = (props, state) => {
  const { note, isEditing, setNewBody } = props;
  const [content, setContent] = state;
  return isEditing ? (
    <NoteEditor body={content} setBody={setContent} />
  ) : (
    <div
      className="note-viewer text-xs"
      dangerouslySetInnerHTML={{ __html: note.content }}
    />
  );
};

const saveAction = (props, state) => {
  const { note, saveNote } = props;
  const [newBody] = state;
  const handleClick = () => {
    const newVersion = {
      id: note.id,
      title: titleRef.current.value,
      content: newBody
    };
    saveNote(newVersion);
  };
  return (
    <button title="Save" onClick={handleClick}>
      <i className="material-icons">done</i>
    </button>
  );
};

const cancelAction = (props, state) => {
  const { note, cancelEdit } = props;
  return (
    <button title="Cancel" onClick={cancelEdit}>
      <i className="material-icons">clear</i>
    </button>
  );
};

const editAction = (props, state) => {
  const { note, editNote } = props;
  const [, setBody] = state;
  return (
    <button
      title="Edit"
      onClick={() => {
        setBody(note.content);
        editNote();
      }}
    >
      <i className="material-icons">edit</i>
    </button>
  );
};

const restoreAction = (props, state) => {
  const { note, restoreNote } = props;
  return (
    <button title="Restore" onClick={restoreNote}>
      <i className="material-icons">cached</i>
    </button>
  );
};

const NoteViewer = props => {
  const updateState = useState();
  const purgeState = useState(false);
  const [purge, setPurge] = purgeState;
  const { note, deleteNote, isEditing } = props;
  if (!note || !note.id) {
    return <div className="flex-1"></div>;
  }

  const deleteAction = () => {
    if (note.deleted && !purge) {
      setPurge(true);
    } else {
      deleteNote();
    }
  };

  const actions = (
    <>
      {note.deleted
        ? restoreAction(props, updateState)
        : isEditing
        ? saveAction(props, updateState)
        : editAction(props, updateState)}
      {isEditing ? cancelAction(props, updateState) : null}
      <button title="Trash" onClick={deleteAction}>
        <i className="material-icons">delete</i>
      </button>
    </>
  );

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="border-b border-gray-400 flex">
        <div className="flex-grow h-8">{titleArea(props)}</div>
        <div className="actions">{actions}</div>
      </div>
      <div className="flex-1">{bodyArea(props, updateState)}</div>
      <PopUp
        visible={purge}
        title="Delete note"
        text="This will permanently delete the note. Do you wish to continue?"
        onContinue={deleteAction}
        onCancel={() => setPurge(false)}
      />
    </div>
  );
};

export default NoteViewer;
