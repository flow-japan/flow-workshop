import React, { useState } from 'react';
import * as fcl from '@onflow/fcl';
import {
  Checkbox,
  Button,
  Code,
  Container,
  Heading,
  Text,
  Box,
  Input,
} from '@chakra-ui/react';

import CodeEditor from './CodeEditor';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';

const simpleTransaction = `\
import HelloWorld from 0x80617c721f7c4cfa

transaction {
  execute {
    HelloWorld.hello(message: "Hello from visitor")
  }
}
`;

const SendTransaction = () => {
  const [status, setStatus] = useState('Not started');
  const [transaction, setTransaction] = useState(null);
  const [transactionCode, setTransactionCode] = useState(simpleTransaction);
  const [gas, setGas] = useState(10);
  const [authorize, setAuthorize] = useState(false);
  const updateGas = (event) => {
    event.preventDefault();

    const intValue = parseInt(event.target.value, 10);
    setGas(intValue);
  };

  const updateTransactionCode = (value) => {
    setTransactionCode(value);
  };
  const sendTransaction = async (event) => {
    event.preventDefault();

    setStatus('Resolving...');
    const blockResponse = await fcl.send([fcl.getLatestBlock()]);
    const block = await fcl.decode(blockResponse);

    const createTxOptions = (gasValue, isRequiredAuthorized) => {
      const txOptions = [
        fcl.transaction(transactionCode),
        fcl.limit(gasValue),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.payer(fcl.currentUser().authorization),
        fcl.ref(block.id),
      ];
      if (isRequiredAuthorized) {
        txOptions.push(fcl.authorizations([fcl.currentUser().authorization]));
      }

      return txOptions;
    };
    const txOptions = createTxOptions(gas, authorize);
    try {
      const { transactionId } = await fcl.send(txOptions);

      setStatus('Transaction sent, waiting for confirmation');

      const unsub = fcl.tx({ transactionId }).subscribe((aTransaction) => {
        setTransaction(aTransaction);
        if (fcl.tx.isSealed(aTransaction)) {
          setStatus('Transaction is Sealed');
          unsub();
        }
      });
    } catch (error) {
      console.error(error);
      setStatus('Transaction failed');
    }
  };

  return (
    <Container m={4}>
      <Box p={2}>
        <Heading size="lg">Send transaction</Heading>
      </Box>
      <Box p={2}>
        <Checkbox
          defaultIsChecked
          value={authorize}
          onChange={() => {
            setAuthorize(!authorize);
          }}
        >
          Authorization required.
        </Checkbox>
      </Box>
      <Box p={2}>
        <Text size="md">Gas Fee:</Text>
        <Input value={gas} onChange={updateGas} size="sm" />
      </Box>
      <Box p={2}>
        <CodeEditor value={transactionCode} onChange={updateTransactionCode} />
      </Box>
      <Box p={2}>
        <Button type="button" onClick={sendTransaction}>
          Send
        </Button>
      </Box>
      <Box p={2}>
        <Code w="100%">Status: {status}</Code>
      </Box>
      <Box p={2}>
        {transaction && (
          <Code w="100%">Result: {JSON.stringify(transaction, null, 2)}</Code>
        )}
      </Box>
    </Container>
  );
};

export default SendTransaction;
