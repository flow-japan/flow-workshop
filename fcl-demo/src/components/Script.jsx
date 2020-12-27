import React, { useState } from 'react';
import * as fcl from '@onflow/fcl';

import { Button, Code, Container, Heading, Box } from '@chakra-ui/react';

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
    await fcl
      .send([fcl.script(script)])
      .then(async (response) => {
        setData(await fcl.decode(response));
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
      <Box p={2}>{data && <Code>{JSON.stringify(data, null, 2)}</Code>}</Box>
    </Container>
  );
}
