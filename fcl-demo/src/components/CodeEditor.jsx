import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import { Box } from '@chakra-ui/react';

const CodeEditor = ({ value, onChange }) => {
  return (
    <Box borderWidth="1px" borderRadius="sm">
      <AceEditor
        mode="java"
        theme="github"
        value={value}
        onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        width="100%"
        wrapEnabled="true"
      />
    </Box>
  );
};

export default CodeEditor;
