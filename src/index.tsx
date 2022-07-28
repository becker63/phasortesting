import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.scss';
import { Flex, HStack, Box } from '@chakra-ui/react'
import Circle from "./components/circle/MainCircle"
import MainChart from './components/chart/MainChart';
import { Provider as BusProvider } from 'react-bus';
import TextData from './textdata';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BusProvider>

    <HStack>
    <div className='chart'>
    <MainChart />
    </div>
    <TextData />
    </HStack>

    <div className='circle'>
      <Circle />
    </div>

    </BusProvider>
  </React.StrictMode>
);
