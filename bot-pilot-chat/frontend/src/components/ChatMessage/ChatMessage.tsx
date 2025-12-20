import React, { Suspense } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import type { ChatMessageText } from '../../domain/ChatMessageText.ts';
import AlarmClock from '../icons/AlarmClock.tsx';
import Markdown from 'react-markdown';
import ChatMessageTextComponent from './ChatMessageTextComponent.tsx';
import { useChatMessageGraphicsService } from '../../service/graphics/ChatMessageGraphicsService.ts';

type Props = {
  msg: ChatMessageText;
};

const ChatMessage: React.FC<Props> = ({ msg }) => {
  const { sender, message: text, timestamp } = msg;
  const isUser = sender === 'user';
  const { chatTextColor, chatBubbleColorUser, chatBubbleColorBot } =
    useChatMessageGraphicsService();
  const CalendarAccessory = React.lazy(
    () => import('./Accessories/CalendarAccessory.tsx')
  );
  const ButtonOptionList = React.lazy(
    () => import('./Accessories/ButtonOptionList.tsx')
  );
  // Farben & Styles je nach Absender
  const backgroundColor = isUser ? chatBubbleColorUser : chatBubbleColorBot;
  const align = isUser ? 'flex-end' : 'flex-start';

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        alignText: align,
        backgroundColor,
        color: chatTextColor,
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
          p: ({ node, ...props }) => (
            <ChatMessageTextComponent>{props.children}</ChatMessageTextComponent>
          ),
          ul: ({ node, ...props }) => (
            <Box component={'ul'} sx={{ pl: 2, mt: 0, mb: 0, listStyleType: 'disc' }}>
              {props.children}
            </Box>
          ),
          li: ({ node, ...props }) => (
            <Box component={'li'} sx={{ display: 'list-item', mb: 0 }}>
              <ChatMessageTextComponent pb={0} pt={0} component={'span'}>
                {props.children}
              </ChatMessageTextComponent>
            </Box>
          ),
        }}
      >
        {text}
      </Markdown>
      <Suspense fallback={null}>
        {msg.accessory === 'calendar' && <CalendarAccessory />}
        {msg.accessory === 'buttons' && msg.buttons && (
          <ButtonOptionList buttons={msg.buttons} />
        )}
      </Suspense>
      <Stack
        direction={'row'}
        pt={1}
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
