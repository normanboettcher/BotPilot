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

        <div ref={endRef} />
      </List>
    </Box>
  );
};

export default Chatverlauf;
