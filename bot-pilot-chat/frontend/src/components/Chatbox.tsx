import { Box } from '@mui/material';
import React from 'react';
import ChatInput from './ChatInput/ChatInput.tsx';
import Chatverlauf from './Chatverlauf';
import useBotResponsive from '../hooks/useBotResponsive.ts';
import ChatHeader from './ChatHeader.tsx';

type Props = {
  onClose: () => void;
};

const Chatbox: React.FC<Props> = ({ onClose }) => {
  const { isMobile } = useBotResponsive();
  return (
    <Box
      id="chatbox"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: isMobile ? '100vw' : 380,
        height: isMobile ? '100dvh' : 568,
        backgroundColor: '#f8fafc',
        borderRadius: isMobile ? 0 : '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        overflow: 'hidden',
      }}
    >
      <ChatHeader onClose={onClose} />
      <Chatverlauf />
      <ChatInput />
    </Box>
  );
};

export default Chatbox;
