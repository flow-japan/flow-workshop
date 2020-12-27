import React, { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import { Button, Container, Box, Heading } from '@chakra-ui/react';

const SignInOutButton = ({ user: { loggedIn } }) => {
  const signInOrOut = async (event) => {
    event.preventDefault();

    if (loggedIn) {
      fcl.unauthenticate();
    } else {
      fcl.authenticate();
    }
  };

  return (
    <Button onClick={signInOrOut}>
      {loggedIn ? 'Sign Out' : 'Sign In / Up'}
    </Button>
  );
};

const Authenticate = () => {
  const [user, setUser] = useState({});

  useEffect(
    () =>
      fcl.currentUser().subscribe((currentUser) => setUser({ ...currentUser })),
    []
  );

  return (
    <Container m={4}>
      <Box p={2}>
        <Heading size="lg">Sign In/Out</Heading>
      </Box>
      <Box p={2}>
        <SignInOutButton user={user} />
      </Box>
    </Container>
  );
};

export default Authenticate;
