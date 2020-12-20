import React, { useEffect, useReducer, useState } from "react";
import cloneDeep from "clone-deep";
import CategoryChooser from "./category-chooser";
import CategoryIcon from "./category-icon";
import NoteEditor from "./note-editor";
import PopUp from "./popup";
import constants from "../constants";
const { VIEW } = constants;

const titleRef = React.createRef();

function noteReducer(state, action) {
  switch (action.type) {
    case "initialise":
      return action.data ? cloneDeep(action.data) : {};
    case "setBody":
      return {
        ...state,
        content: action.data
      };
    case "setCategory":
      return {
        ...state,
        category: action.data
      };
    case "setTitle":
      return {
        ...state,
        title: action.data
      };
    default:
      return state;
  }
}

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

const bodyArea = (props, state, noteDispatch) => {
  const { isEditing, setNewBody } = props;
  return isEditing ? (
    <NoteEditor
      key={state.id}
      body={state.content}
      setBody={b => noteDispatch({ type: "setBody", data: b })}
    />
  ) : (
    <div
      className="note-viewer text-xs"
      dangerouslySetInnerHTML={{ __html: state.content }}
    />
  );
};

const saveAction = (props, state) => {
  const { note, saveNote } = props;
  const handleClick = () => {
    const newVersion = {
      id: note.id,
      title: titleRef.current.value,
      content: state.content,
      category: state.category,
      isNew: state.isNew
    };
    saveNote(newVersion);
  };
  return (
    <button title="Save" onClick={handleClick}>
      <i className="material-icons">done</i>
    </button>
  );
};

const cancelAction = props => {
  const { note, cancelEdit } = props;
  return (
    <button title="Cancel" onClick={cancelEdit}>
      <i className="material-icons">clear</i>
    </button>
  );
};

const editAction = props => {
  const { note, editNote } = props;
  return (
    <button title="Edit" onClick={editNote}>
      <i className="material-icons">edit</i>
    </button>
  );
};

const restoreAction = props => {
  const { note, restoreNote } = props;
  return (
    <button title="Restore" onClick={restoreNote}>
      <i className="material-icons">cached</i>
    </button>
  );
};

const NoteViewer = props => {
  const [state, noteDispatch] = useReducer(noteReducer, {});
  const purgeState = useState(false);
  const [purge, setPurge] = purgeState;
  const { note, deleteNote, isEditing } = props;

  useEffect(() => {
    noteDispatch({ type: "initialise", data: note });
  }, [note && note.id]);

  if (!note || !note.id) {
    return <div className="flex-1"></div>;
  }

  const deleteAction = () => {
    if (note.folder === VIEW.DELETED && !purge) {
      setPurge(true);
    } else {
      deleteNote();
      setPurge(false);
    }
  };

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
        ? restoreAction(props)
        : isEditing
        ? saveAction(props, state)
        : editAction(props)}
      {isEditing ? cancelAction(props) : null}
      <button title="Trash" onClick={deleteAction}>
        <i className="material-icons">delete</i>
      </button>
    </>
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-400 flex">
        <div className="flex-grow h-8">{titleArea(props)}</div>
        <div className="actions">{actions}</div>
      </div>
      <div className="flex-1">{bodyArea(props, state, noteDispatch)}</div>
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
