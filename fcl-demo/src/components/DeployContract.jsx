import React, { useState } from 'react';
import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';
import {
  Button,
  Code,
  Container,
  Heading,
  Box,
  Input,
  Text,
} from '@chakra-ui/react';
import CodeEditor from './CodeEditor';
import JsonViewer from './JsonViewer';

const deployTransaction = `\
transaction(code: String) {
  prepare(acct: AuthAccount) {
    acct.contracts.add(name: "HelloWorld", code: code.decodeHex())
  }
}
`;

const simpleContract = `\
pub contract HelloWorld {
  pub let greeting: String
  pub event HelloEvent(message: String)

  init() {
    self.greeting = "Hello, World!"
  }

  pub fun hello(message: String): String {
    emit HelloEvent(message: message)
    return self.greeting
  }
}
`;

const DeployContract = () => {
  const [status, setStatus] = useState('Not started');
  const [transactionResult, setTransactionResult] = useState();
  const [contractName, setContractName] = useState('HelloWorld');
  const [transaction, setTransaction] = useState(deployTransaction);

  // Create contract code with the name passed from front.

  const updateContractName = (event) => {
    setContractName(event.target.value);
    const string = `\
    transaction(code: String) {
      prepare(acct: AuthAccount) {
        acct.contracts.add(name: "${event.target.value}", code: code.decodeHex())
      }
    }
    `;
    setTransaction(string);
  };

  const [contract, setContract] = useState(simpleContract);
  const updateContract = (value) => {
    setContract(value);
  };

  const runTransaction = async (event) => {
    event.preventDefault();

    setStatus('Resolving...');

    // Get latest block number.
    const isSealed = false;
    const blockResponse = await fcl.send([fcl.getBlock(isSealed)]);
    const block = await fcl.decode(blockResponse);

    // Execute transaction
    try {
      const { transactionId } = await fcl.send([
        fcl.transaction(transaction), // Pass transaction code
        fcl.args([
          fcl.arg(Buffer.from(contract, 'utf8').toString('hex'), t.String), // Pass cadence script as an argument
        ]),
        fcl.limit(100), // Set Network token which will be consumed with this transaction
        fcl.proposer(fcl.currentUser().authorization),
        fcl.authorizations([fcl.currentUser().authorization]),
        fcl.payer(fcl.currentUser().authorization),
        fcl.ref(block.id),
      ]);

      setStatus('Transaction sent, waiting for confirmation');

      // fetch transaction status until it has been confirmed in blockchain.
      const unsub = fcl.tx({ transactionId }).subscribe((aTransaction) => {
        setTransactionResult(aTransaction);

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
    <Container m={4} maxWidth="3xl">
      <Box p={2}>
        <Heading size="lg">Deploy contract</Heading>
      </Box>
      <Box p={2}>
        <Text>Please input the name of the contract.</Text>
        <Input value={contractName} onChange={updateContractName} />
      </Box>
      <Box p={2}>
        <Text size="md">Transaction(generated automatically)</Text>
        <JsonViewer value={transaction} height="100px" />
      </Box>
      <Box p={2}>
        <Text size="md">Please edit the contract to be deployed.</Text>
        <CodeEditor value={contract} onChange={updateContract} />
      </Box>
      <Box p={2}>
        <Button type="button" onClick={runTransaction}>
          Deploy Contract
        </Button>
      </Box>
      <Box p={2}>
        <Code w="100%">Status: {status}</Code>
      </Box>
      <Box p={2}>
        <Heading size="md">Result:</Heading>
        <JsonViewer value={JSON.stringify(transactionResult, null, 2)} />
      </Box>
    </Container>
  );
};

export default DeployContract;
