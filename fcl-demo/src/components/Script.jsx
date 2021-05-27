import React, { useState } from 'react';
import * as fcl from '@onflow/fcl';
import { Button, Container, Heading, Box } from '@chakra-ui/react';
import JsonViewer from './JsonViewer';
import CodeEditor from './CodeEditor';

const scriptOne = `\
pub fun main(): Int {
  return 42 + 6
}
`;

export default function Script() {
  const [data, setData] = useState(null);
  const [script, setScript] = useState(scriptOne);

  const updateScript = (value) => {
    setScript(value);
  };

  const runScript = async (event) => {
    event.preventDefault();

    // send script to blockchain.
    await fcl
      .send([fcl.script(script)]) // set scripts which will be sent.
      .then(async (response) => {
        const decodedResponse = await fcl.decode(response); // decode its response.
        setData(decodedResponse);
      })
      .catch((error) => {
        setData(String(error));
      });
  };

  return (
    <Container m={4} maxWidth="3xl">
      <Box p={2}>
        <Heading size="lg">Run script</Heading>
      </Box>
      <Box p={2}>
        <CodeEditor value={script} onChange={updateScript} />
      </Box>
      <Box p={2}>
        <Button onClick={runScript}>Run Script</Button>
      </Box>
      <Box p={2}>
        {data && <JsonViewer value={JSON.stringify(data, null, 2)} />}
      </Box>
    </Container>
  );
}
