import Chat from '@mui/icons-material/Chat';
import { Box, Button } from '@mui/material';
import React from 'react';
import BotAvatar, { MessageChatbot } from '../icons/BotAvatar.tsx';

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const ChatBotButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Box>
      <Button
        id="chatbot-toggle"
        onClick={onClick}
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            backgroundColor: '#2563eb',
          },
        }}
      >
        {MessageChatbot()}
      </Button>
    </Box>
  );
};

export default ChatBotButton;
