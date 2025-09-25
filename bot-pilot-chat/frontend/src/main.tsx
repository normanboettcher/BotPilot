import ReactDOM from 'react-dom/client';
import './style.css';
import React from 'react';
import App from './App.tsx';
import { ChatContextProvider } from './context/ChatContext.tsx';
import { CalendarAccessory } from './components/ChatMessage/Accessories/CalendarAccessory';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ChatContextProvider>
      <App />
    </ChatContextProvider>
  </React.StrictMode>
);
