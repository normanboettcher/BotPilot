import React from 'react';
import BotContainer from './components/BotContainer.tsx';
import CalendarAccessory from './components/ChatMessage/Accessories/CalendarAccessory.tsx';

const App = (): React.ReactNode => {
  return (
    <>
      <CalendarAccessory />
      <BotContainer />
    </>
  );
};

export default App;
