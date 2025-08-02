import React from 'react';
import SenderAvatar from '../Avatar/SenderAvatar.tsx';
import type { ChatMessageType } from '../../domain/ChatMessage.ts';
import { Box, Stack } from '@mui/material';
import ChatMessage from './ChatMessage.tsx';
import useBotResponsive from '../../hooks/useBotResponsive.ts';

type Props = {
  chatMessage: ChatMessageType;
};

const ChatMessageContainer: React.FC<Props> = ({ chatMessage }) => {
  const { sender } = chatMessage;
  const { isMobile } = useBotResponsive();
  return (
    <Box
      width={'100%'}
      display={'flex'}
      justifyContent={sender === 'user' ? 'flex-end' : 'flex-start'}
    >
      <Stack
        alignItems={'flex-start'}
        direction={sender === 'user' ? 'row-reverse' : 'row'}
        spacing={1}
        width={'100%'}
      >
        <Box sx={{ position: 'relative', top: '-15px' }}>
          <SenderAvatar sender={sender} />
        </Box>
        <Box
          sx={{
            minWidth: isMobile ? '70%' : '60%',
            maxWidth: isMobile ? '70%' : '60%',
          }}
        >
          <ChatMessage msg={chatMessage} />
        </Box>
      </Stack>
    </Box>
  );
};

export default ChatMessageContainer;
