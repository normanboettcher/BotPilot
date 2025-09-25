import React from 'react';
import BotContainer from './components/BotContainer.tsx';
import CalendarAccessory from './components/ChatMessage/Accessories/CalendarAccessory.tsx';
import { busyEventsMock } from './components/mocks/MockBusyEvents.ts';

const App = (): React.ReactNode => {
  return (
    <>
      <CalendarAccessory busyHours={busyEventsMock.busyEvents} />
      <BotContainer />
    </>
  );
};

export default App;
