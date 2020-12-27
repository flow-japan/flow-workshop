import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import GetAccount from './components/GetAccount';
import Script from './components/Script';
import Authenticate from './components/Authenticate';
import UserInfo from './components/UserInfo';
import SendTransaction from './components/SendTransaction';
import DeployContract from './components/DeployContract';

function App() {
  return (
    <Tabs>
      <TabList>
        <Tab>Authenticate</Tab>
        <Tab>Get Account Info</Tab>
        <Tab>Send Script</Tab>
        <Tab>Send Transaction</Tab>
        <Tab>Deploy Contract</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Authenticate />
          <UserInfo />
        </TabPanel>
        <TabPanel>
          <GetAccount />
        </TabPanel>
        <TabPanel>
          <Script />
        </TabPanel>
        <TabPanel>
          <SendTransaction />
        </TabPanel>
        <TabPanel>
          <DeployContract />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default App;
