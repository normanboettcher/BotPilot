import React from 'react';
import BotContainer from './components/BotContainer.tsx';
import { SocketContextProvider } from './context/SocketContext.tsx';
import { ChatContextProvider } from './context/ChatContext.tsx';
import { TenantThemeProvider } from './context/TenantThemeContext.tsx';

const App = (): React.ReactNode => {
  return (
    <TenantThemeProvider>
      <ChatContextProvider>
        <SocketContextProvider>
          <BotContainer />
        </SocketContextProvider>
      </ChatContextProvider>
    </TenantThemeProvider>
  );
};

export default App;
