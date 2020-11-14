import React, { useState } from 'react';
import NoteEditor from './note-editor';
import textExtractor from '../util/simple-text-extractor';

const titleRef = React.createRef();
const bodyRef = React.createRef();

const titleArea = props => {
  const { note, isEditing } = props;
  return isEditing
    ? <input
        type="text"
        ref={titleRef}
        defaultValue={note.title}
        className="w-full border border-green-300"/>
    : note.title;
}

const bodyArea = (props, state) => {
  const { note, isEditing, setNewBody } = props;
  const [ body, setBody ] = state;
  return isEditing
    ? <NoteEditor body={body} setBody={setBody}/>
    : <div className="note-viewer text-xs" dangerouslySetInnerHTML={{__html: note.body}}/>
}

const saveAction = (props, state) => {
  const { note, saveNote } = props;
  const [ newBody ] = state;
  const newSynopsis = textExtractor(newBody);
  const handleClick = () => {
    const newVersion = {
      id: note.id,
      title: titleRef.current.value,
      synopsis: newSynopsis,
      body: newBody
    };
    saveNote(newVersion);
  }
  return (
    <button title="Save"
      onClick={handleClick}>
      <i className="material-icons">done</i>
    </button>
  );
}

const cancelAction = (props, state) => {
  const { note, cancelEdit } = props;
  const handleClick = () => {
    cancelEdit();
  }
  return (
    <button title="Cancel"
      onClick={handleClick}>
      <i className="material-icons">clear</i>
    </button>
  );
}

const editAction = (props, state) => {
  const { note, editNote } = props;
  const [ , setBody ] = state;
  return (
    <button title="Edit"
      onClick={() => {
        setBody(note.body)
        editNote()
      }}>
      <i className="material-icons">edit</i>
    </button>
  );
}

const NoteViewer = props => {
  const state = useState();
  const { note, deleteNote, isEditing } = props;
  if (!note || !note.id) {
    return <div className="flex-1"></div>;
  }

  const actions = (
    <>
      { isEditing ? saveAction(props, state) : editAction(props, state) }
      { isEditing ? cancelAction(props, state) : null }
      <button title="Trash"
        onClick={() => deleteNote()}>
        <i className="material-icons">delete</i>
      </button>
    </>
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-400 flex">
        <div className="flex-grow h-8">
          { titleArea(props) }
        </div>
        <div className="actions">
          { actions }
        </div>
      </div>
      <div className="flex-1">
        { bodyArea(props, state) }
      </div>
    </div>
  );
}

export default NoteViewer;
