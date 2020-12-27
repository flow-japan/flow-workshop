import React, { useState } from 'react';
import * as fcl from '@onflow/fcl';
import { Input, Button, Container, Heading, Box } from '@chakra-ui/react';
import JsonViewer from './JsonViewer';

const GetAccount = () => {
  const [data, setData] = useState();
  const [addr, setAddr] = useState(null);
  const runGetAccount = async (event) => {
    event.preventDefault();
    const response = await fcl.send([fcl.getAccount(addr)]);
    const decodedResponse = await fcl.decode(response);
    setData(JSON.stringify(decodedResponse, null, 2));
  };

  const updateAddr = (event) => {
    event.preventDefault();

    setAddr(event.target.value);
  };

  return (
    <Container m={4} maxWidth="3xl">
      <Box p={2}>
        <Heading size="lg">Get Account Information</Heading>
      </Box>
      <Box p={2}>
        <Input
          placeholder="Enter Flow address"
          onChange={updateAddr}
          size="md"
        />
      </Box>
      <Box p={2}>
        <Button type="button" onClick={runGetAccount} variant="solid">
          Check Balance
        </Button>
      </Box>
      <Box p={2}>
        <Heading size="md">Result:</Heading>
        <JsonViewer value={data} />
      </Box>
    </Container>
  );
};

export default GetAccount;
