import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { Box } from '@chakra-ui/react';

const JsonViewer = ({ value, onChange, height = '500px' }) => {
  return (
    <Box borderWidth="1px" borderRadius="sm">
      <AceEditor
        mode="json"
        theme="tomorrow"
        showGutter={false}
        readOnly
        value={value}
        height={height}
        onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        width="100%"
        wrapEnabled
      />
    </Box>
  );
};

export default JsonViewer;
