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
      sx={{
        overflow: 'auto',
        flex: 1,
        width: '100%',
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '2px' },
      }}
    >
      <List sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {messages?.map((msg, index) => (
          <ListItem key={index} sx={{ p: 0.5 }}>
            <ChatMessageContainer chatMessage={msg} />
          </ListItem>
        ))}
        <div ref={endRef} />
      </List>
    </Box>
  );
};

export default Chatverlauf;
