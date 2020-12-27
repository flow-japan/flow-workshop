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
  const [transactionResult, setTransactionResult] = useState('');
  const [contractName, setContractName] = useState('HelloWorld');
  const [transaction, setTransaction] = useState(deployTransaction);
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

    const blockResponse = await fcl.send([fcl.getLatestBlock()]);

    const block = await fcl.decode(blockResponse);

    try {
      const { transactionId } = await fcl.send([
        fcl.transaction(transaction),
        fcl.args([
          fcl.arg(Buffer.from(contract, 'utf8').toString('hex'), t.String),
        ]),
        fcl.limit(100),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.authorizations([fcl.currentUser().authorization]),
        fcl.payer(fcl.currentUser().authorization),
        fcl.ref(block.id),
      ]);

      setStatus('Transaction sent, waiting for confirmation');

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
    <Container m={4}>
      <Box p={2}>
        <Heading size="lg">Deploy contract</Heading>
      </Box>
      <Box p={2}>
        <Text>Please input a name of the contract.</Text>
        <Input value={contractName} onChange={updateContractName} />
      </Box>
      <Box p={2}>
        <Text size="md">Transaction:</Text>
        <Code>{transaction}</Code>
      </Box>
      <Box p={2}>
        <Text size="md">Contract:</Text>
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
        {transactionResult && (
          <Code w="100%">
            Result: {JSON.stringify(transactionResult, null, 2)}
          </Code>
        )}
      </Box>
    </Container>
  );
};

export default DeployContract;
