import React from 'react';
import SenderAvatar from '../Avatar/SenderAvatar.tsx';
import type {
  ChatMessageButton,
  ChatMessageText,
} from '../../domain/ChatMessageText.ts';
import { Box, Stack } from '@mui/material';
import ChatMessage from './ChatMessage.tsx';
import useBotResponsive from '../../hooks/useBotResponsive.ts';

type Props = {
  chatMessage: ChatMessageText | ChatMessageButton;
};

const ChatMessageContainer: React.FC<Props> = ({ chatMessage }) => {
  const { sender } = chatMessage;
  const { isMobile } = useBotResponsive();
  const isUser = sender === 'user';
  return (
    <Box
      width={'100%'}
      display={'flex'}
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
    >
      <Stack
        alignItems={'flex-start'}
        direction={isUser ? 'row-reverse' : 'row'}
        spacing={isUser ? (isMobile ? -0.5 : -1) : 1}
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
          {chatMessage.type === 'text' && <ChatMessage msg={chatMessage} />}
        </Box>
      </Stack>
    </Box>
  );
};

export default ChatMessageContainer;
