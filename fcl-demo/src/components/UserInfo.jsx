import React, { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import { Container, Heading, Box } from '@chakra-ui/react';
import JsonViewer from './JsonViewer';

const UserInfo = () => {
  const [user, setUser] = useState(null);

  useEffect(
    () =>
      fcl.currentUser().subscribe((currentUser) => setUser({ ...currentUser })),
    []
  );

  return (
    <Container m={4} maxWidth="3xl">
      <Box p={2}>
        <Heading size="lg">Current User info</Heading>
      </Box>
      <Box p={2}>
        <JsonViewer value={JSON.stringify(user, null, 2)} />
      </Box>
    </Container>
  );
};

export default UserInfo;
