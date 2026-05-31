import { Box, IconButton } from '@mui/material';
import React from 'react';
import { MessageChatbot } from '../icons/BotAvatar.tsx';
import CloseIcon from '@mui/icons-material/Close';
import { useTenantTheme } from '../../context/TenantThemeContext.tsx';

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  isOpen: boolean;
};

const ChatBotButton: React.FC<Props> = ({ onClick, isOpen }) => {
  const { primaryColor } = useTenantTheme();
  return (
    <Box>
      <IconButton
        id="chatbot-toggle"
        onClick={onClick}
        aria-label={isOpen ? 'Chat schließen' : 'Chat öffnen'}
        sx={{
          backgroundColor: primaryColor,
          color: '#ffffff',
          width: 56,
          height: 56,
          boxShadow: '0 4px 16px rgba(30,64,175,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s, filter 0.2s',
          '&:hover': {
            backgroundColor: primaryColor,
            filter: 'brightness(1.12)',
            boxShadow: '0 6px 20px rgba(30,64,175,0.5)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {isOpen ? (
          <CloseIcon sx={{ fontSize: '1.4rem' }} />
        ) : (
          MessageChatbot({ fill: 'white', width: '1.4em', height: '1.4em' })
        )}
      </IconButton>
    </Box>
  );
};

export default ChatBotButton;
