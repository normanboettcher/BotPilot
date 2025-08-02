import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import type { ChatMessageType } from '../../domain/ChatMessage.ts';
import useBotResponsive from '../../hooks/useBotResponsive.ts';
import AlarmClock from '../icons/AlarmClock.tsx';

type Props = {
  msg: ChatMessageType;
};

const ChatMessage: React.FC<Props> = ({ msg }) => {
  const { sender, message: text, timestamp } = msg;
  const isUser = sender === 'user';
  const { isDarkTheme } = useBotResponsive();
  // Farben & Styles je nach Absender
  const backgroundColor = isUser ? 'primary.main' : isDarkTheme ? 'grey.500' : 'grey.800';
  const textColor = 'white';
  const align = isUser ? 'flex-end' : 'flex-start';
  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        alignText: align,
        backgroundColor,
        color: textColor,
        borderRadius: '16px',
        borderTopLeftRadius: sender === 'bot' ? '0px' : '16px',
        borderTopRightRadius: sender === 'user' ? '0px' : '16px',
        hyphens: 'auto',
        lang: 'de',
        p: 1.5,
        m: 0.5,
        maxWidth: '80%',
        textShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          width: 0,
          height: 0,
          border: '10px solid transparent',
          borderBottom: isUser ? '10px solid' : '10px solid',
          borderBottomColor: isUser ? 'primary.main' : isDarkTheme ? 'grey.500' : 'grey.800',
          right: isUser ? -10 : 'auto',
          left: isUser ? 'auto' : -10,
          transform: isUser ? 'translateY(-5%)  rotate(150deg)' : 'translateY(-5%)  rotate(200deg)',
        },
      }}
    >
      <Typography
        variant={'body2'}
        pb={1}
        pt={0}
        sx={{
          wordBreak: 'word-break',
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
      </Typography>
      <Stack
        direction={'row'}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'start',
        }}
      >
        <AlarmClock />
        <Typography variant={'caption'} sx={{ paddingLeft: '5px' }}>
          {timestamp}
        </Typography>
      </Stack>
    </Box>
  );
};

export default ChatMessage;
