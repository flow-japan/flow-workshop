import React, { useState } from 'react';
import * as fcl from '@onflow/fcl';
import { Input, Button, Code, Container, Heading, Box } from '@chakra-ui/react';

const GetAccount = () => {
  const [data, setData] = useState(null);
  const [addr, setAddr] = useState(null);
  const runGetAccount = async (event) => {
    event.preventDefault();
    const response = await fcl.send([fcl.getAccount(addr)]);
    setData(await fcl.decode(response));
  };

  const updateAddr = (event) => {
    event.preventDefault();

    setAddr(event.target.value);
  };

  return (
    <Container m={4}>
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
      <Box p={2}>{data && <Code>{JSON.stringify(data, null, 2)}</Code>}</Box>
    </Container>
  );
};

export default GetAccount;
