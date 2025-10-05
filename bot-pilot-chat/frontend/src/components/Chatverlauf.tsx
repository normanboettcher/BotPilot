import { Box, List, ListItem } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useChatverlauf } from '../context/ChatContext';

import ChatMessageContainer from './ChatMessage/ChatMessageContainer.tsx';

const Chatverlauf: React.FC = () => {
  const { messages } = useChatverlauf();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box
      style={{
        overflow: 'auto',
        height: '100%',
        width: '100%',
      }}
    >
      <List
        sx={{
          p: 1,
        }}
      >
        {messages &&
          messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                padding: 1,
                paddingLeft: msg.sender === 'bot' ? 0 : 1,
                paddingRight: msg.sender === 'user' ? 0 : 1,
              }}
            >
              <ChatMessageContainer chatMessage={msg} />
            </ListItem>
          ))}
        <ChatMessageContainer
          chatMessage={{
            message: 'bitte waehlen sie einen termin',
            timestamp: Date.parse(
              new Date().toLocaleDateString('de-DE')
            ).toLocaleString('de-DE'),
            sender: 'bot',
            type: 'text',
            accessory: 'calendar',
          }}
        />
        <ChatMessageContainer
          chatMessage={{
            message: 'Termin Typ bitte',
            timestamp: Date.parse(
              new Date().toLocaleDateString('de-DE')
            ).toLocaleString('de-DE'),
            sender: 'bot',
            type: 'text',
            accessory: 'buttons',
            buttons: [
              {
                title: 'Button 1',
                payload: '/termin_type_inform{"termin_type": "button 1"}',
              },
              {
                title: 'Button 2',
                payload: '/termin_type_inform{"termin_type": "button 2"}',
              },
              {
                title: 'Button 3',
                payload: '/termin_type_inform{"termin_type": "button 3"}',
              },
              {
                title: 'Button 4',
                payload: '/termin_type_inform{"termin_type": "button 4"}',
              },
              {
                title: 'Button 5',
                payload: '/termin_type_inform{"termin_type": "button 5"}',
              },
            ],
          }}
        />
        <div ref={endRef} />
      </List>
    </Box>
  );
};

export default Chatverlauf;
