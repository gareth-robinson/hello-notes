import ReactQuill from "react-quill";
import React, { useState } from "react";

const NoteEditor = props => {
  const { body, setBody } = props;

  return <ReactQuill defaultValue={body} onChange={e => setBody(e)} />;
};

export default NoteEditor;
