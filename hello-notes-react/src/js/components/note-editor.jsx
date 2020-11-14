import ReactQuill from 'react-quill';
import React, {useState} from 'react';

const NoteEditor = props => {
  const { body, setBody } = props

  return <ReactQuill
    value={body}
    onChange={e => setBody(e)} />
}

export default NoteEditor;
