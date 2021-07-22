import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import { Box } from '@chakra-ui/react';

const CodeEditor = ({ value, maxLines = 30, onChange }) => {
  return (
    <Box borderWidth="1px" borderRadius="sm">
      <AceEditor
        mode="javascript"
        theme="github"
        value={value}
        onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        width="100%"
        wrapEnabled
        maxLines={Number(maxLines)}
        setOptions={{useWorker: false}}
      />
    </Box>
  );
};

export default CodeEditor;
