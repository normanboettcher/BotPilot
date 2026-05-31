import React from 'react';
import SenderAvatar from '../Avatar/SenderAvatar.tsx';
import type { ChatMessageText } from '../../domain/ChatMessageText.ts';
import { Box, Stack } from '@mui/material';
import ChatMessage from './ChatMessage.tsx';

type Props = {
  chatMessage: ChatMessageText;
};

const ChatMessageContainer: React.FC<Props> = ({ chatMessage }) => {
  const { sender } = chatMessage;
  const isUser = sender === 'user';
  return (
    <Box width="100%" display="flex" justifyContent={isUser ? 'flex-end' : 'flex-start'}>
      <Stack
        direction={isUser ? 'row-reverse' : 'row'}
        alignItems="flex-end"
        spacing={0.75}
        sx={{ maxWidth: '85%' }}
      >
        <Box sx={{ flexShrink: 0, mb: 0.25 }}>
          <SenderAvatar sender={sender} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <ChatMessage msg={chatMessage} />
        </Box>
      </Stack>
    </Box>
  );
};

export default ChatMessageContainer;
