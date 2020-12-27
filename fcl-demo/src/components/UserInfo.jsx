import React, { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import { Code, Container, Heading, Box } from '@chakra-ui/react';

const UserInfo = () => {
  const [user, setUser] = useState(null);

  useEffect(
    () => fcl.currentUser().subscribe((anUser) => setUser({ ...anUser })),
    []
  );

  return (
    <Container m={4}>
      <Box p={2}>
        <Heading size="lg">Current User info</Heading>
      </Box>
      <Box p={2}>{user && <Code>{JSON.stringify(user, null, 2)}</Code>}</Box>
    </Container>
  );
};

export default UserInfo;
