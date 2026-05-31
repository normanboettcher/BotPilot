import { Box } from '@mui/material';
import React, { Suspense, useEffect, useState } from 'react';
import ChatBotButton from './Buttons/ChatBotButton.tsx';
import useBotResponsive from '../hooks/useBotResponsive.ts';

const BotContainer = (): React.ReactNode => {
  const [visible, setVisible] = useState(false);
  const { isMobile } = useBotResponsive();
  const Chatbox = React.lazy(() => import('./Chatbox'));

  useEffect(() => {
    const setVH = () =>
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  return (
    <>
      {isMobile ? (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: visible ? 'flex' : 'none',
          }}
        >
          <Suspense>
            <Chatbox onClose={() => setVisible(false)} />
          </Suspense>
        </Box>
      ) : (
        <Box
          sx={{
            position: 'fixed',
            bottom: 88,
            right: 16,
            zIndex: 9998,
            display: visible ? 'block' : 'none',
          }}
        >
          <Suspense>
            <Chatbox onClose={() => setVisible(false)} />
          </Suspense>
        </Box>
      )}

      {(!isMobile || !visible) && (
        <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
          <ChatBotButton onClick={() => setVisible(!visible)} isOpen={visible} />
        </Box>
      )}
    </>
  );
};

export default BotContainer;
