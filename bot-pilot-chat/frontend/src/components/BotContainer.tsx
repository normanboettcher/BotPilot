import { Box, Stack } from '@mui/material';
import React, { Suspense, useEffect, useState } from 'react';
import ChatBotButton from './Buttons/ChatBotButton.tsx';
import useBotResponsive from '../hooks/useBotResponsive.ts';

const BotContainer = (): React.ReactNode => {
  const [visible, setVisible] = useState<boolean>(false);
  const { isMobile } = useBotResponsive();
  const Chatbox = React.lazy(() => import('./Chatbox'));

  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      );
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);
  return (
    <Stack
      id="chatbot-container"
      direction={visible ? 'column' : 'column-reverse'}
      spacing={1}
      sx={{
        position: 'fixed',
        width: isMobile ? '90wv' : 400,
        maxWidth: 400,
        height: isMobile ? 'calc(var(--vh, 1vh) * 90)' : 420,
        bottom: isMobile ? 0 : 16,
        right: isMobile ? 0 : 16,
        left: isMobile ? 0 : 'auto',
        top: isMobile ? 0 : 'auto',
        padding: isMobile ? '1rem' : '2rem',
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: visible ? 'flex-start' : 'flex-end',
        }}
      >
        <ChatBotButton onClick={() => setVisible(!visible)} />
      </Box>
      <Suspense>
        <Chatbox visible={visible} />
      </Suspense>
    </Stack>
  );
};

export default BotContainer;
