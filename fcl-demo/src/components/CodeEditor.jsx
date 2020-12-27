import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';

const CodeEditor = ({ value, onChange }) => {
  return (
    <div>
      <AceEditor
        mode="java"
        theme="github"
        value={value}
        onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
      />
    </div>
  );
};

export default CodeEditor;
