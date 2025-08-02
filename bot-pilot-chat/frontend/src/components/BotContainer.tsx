import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ChatBotButton from './Buttons/ChatBotButton.tsx';
import Chatbox from './Chatbox';
import useBotResponsive from '../hooks/useBotResponsive.ts';

const BotContainer = (): React.ReactNode => {
  const [visible, setVisible] = useState<boolean>(false);
  const { isMobile } = useBotResponsive();

  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);
  return (
    <Box
      id="chatbot-container"
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
      <ChatBotButton onClick={() => setVisible(!visible)} />
      <Chatbox visible={true} />
    </Box>
  );
};

export default BotContainer;
