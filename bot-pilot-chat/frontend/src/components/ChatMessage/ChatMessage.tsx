import React from 'react';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import type { ChatMessageType } from '../../domain/ChatMessage.ts';
import useBotResponsive from '../../hooks/useBotResponsive.ts';
import AlarmClock from '../icons/AlarmClock.tsx';
import Markdown from 'react-markdown';
import ChatMessageText from './ChatMessageText.tsx';

type Props = {
  msg: ChatMessageType;
};

const ChatMessage: React.FC<Props> = ({ msg }) => {
  const { sender, message: text, timestamp } = msg;
  const isUser = sender === 'user';
  const theme = useTheme();
  const { isDarkTheme } = useBotResponsive();
  // Farben & Styles je nach Absender
  const backgroundColor = isUser
    ? theme.palette.primary.main
    : isDarkTheme
      ? theme.palette.grey[500]
      : theme.palette.grey[500];
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
      }}
    >
      <Markdown
        components={{
          p: ({ node, ...props }) => <ChatMessageText>{props.children}</ChatMessageText>,
          ul: ({ node, ...props }) => (
            <Box component={'ul'} sx={{ pl: 2, mt: 0, mb: 0, listStyleType: 'disc' }}>
              {props.children}
            </Box>
          ),
          li: ({ node, ...props }) => (
            <Box component={'li'} sx={{ display: 'list-item', mb: 0 }}>
              <ChatMessageText pb={0} pt={0} component={'span'}>
                {props.children}
              </ChatMessageText>
            </Box>
          ),
        }}
      >
        {text}
      </Markdown>
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
