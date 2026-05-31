import React, { Suspense } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import type { ChatMessageText } from '../../domain/ChatMessageText.ts';
import Markdown from 'react-markdown';
import ChatMessageTextComponent from './ChatMessageTextComponent.tsx';
import { useChatMessageGraphicsService } from '../../service/graphics/ChatMessageGraphicsService.ts';

type Props = {
  msg: ChatMessageText;
};

const ChatMessage: React.FC<Props> = ({ msg }) => {
  const { sender, message: text, timestamp } = msg;
  const isUser = sender === 'user';
  const { chatBubbleColorUser, chatBubbleColorBot, userTextColor, chatTextColor } =
    useChatMessageGraphicsService();

  const CalendarAccessory = React.lazy(() => import('./Accessories/CalendarAccessory.tsx'));
  const ButtonOptionList = React.lazy(() => import('./Accessories/ButtonOptionList.tsx'));

  const backgroundColor = isUser ? chatBubbleColorUser : chatBubbleColorBot;
  const textColor = isUser ? userTextColor : chatTextColor;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor,
        color: textColor,
        borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
        hyphens: 'auto',
        lang: 'de',
        px: 1.5,
        pt: 1.25,
        pb: 0.75,
        maxWidth: '100%',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <Markdown
        components={{
          p: ({ node, ...props }) => (
            <ChatMessageTextComponent sx={{ color: textColor }}>
              {props.children}
            </ChatMessageTextComponent>
          ),
          ul: ({ node, ...props }) => (
            <Box component="ul" sx={{ pl: 2, mt: 0, mb: 0, listStyleType: 'disc' }}>
              {props.children}
            </Box>
          ),
          li: ({ node, ...props }) => (
            <Box component="li" sx={{ display: 'list-item', mb: 0 }}>
              <ChatMessageTextComponent pb={0} pt={0} component="span" sx={{ color: textColor }}>
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

      <Stack direction="row" justifyContent="flex-end" alignItems="center" mt={0.5}>
        <Typography
          sx={{
            fontSize: '0.65rem',
            color: isUser ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)',
            lineHeight: 1,
          }}
        >
          {timestamp}
        </Typography>
      </Stack>
    </Box>
  );
};

export default ChatMessage;
