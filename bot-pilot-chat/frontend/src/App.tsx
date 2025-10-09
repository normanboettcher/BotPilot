import React from 'react';
import BotContainer from './components/BotContainer.tsx';
import { SocketContextProvider } from './context/SocketContext.tsx';

const App = (): React.ReactNode => {
  return (
    <>
      <SocketContextProvider>
        <BotContainer />
      </SocketContextProvider>
    </>
  );
};

export default App;
