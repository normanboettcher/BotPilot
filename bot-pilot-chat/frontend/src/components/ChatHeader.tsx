import React from 'react';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTenantTheme } from '../context/TenantThemeContext.tsx';
import { MessageChatbot } from './icons/BotAvatar.tsx';

type Props = {
  onClose: () => void;
};

const ChatHeader: React.FC<Props> = ({ onClose }) => {
  const { primaryColor, botName, logoUrl } = useTenantTheme();

  return (
    <Box
      sx={{
        backgroundColor: primaryColor,
        px: 2,
        py: 1.25,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        flexShrink: 0,
      }}
    >
      <Avatar
        src={logoUrl ?? undefined}
        sx={{
          bgcolor: 'rgba(255,255,255,0.2)',
          width: 38,
          height: 38,
          flexShrink: 0,
        }}
      >
        {!logoUrl && MessageChatbot({ fill: 'white', width: '1.1em', height: '1.1em' })}
      </Avatar>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.9375rem',
            color: '#ffffff',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {botName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#4ade80',
              flexShrink: 0,
            }}
          />
          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)' }}>
            Online
          </Typography>
        </Box>
      </Box>

      <IconButton
        onClick={onClose}
        size="small"
        aria-label="Chat schließen"
        sx={{
          color: '#ffffff',
          flexShrink: 0,
          '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
        }}
      >
        <CloseIcon sx={{ fontSize: '1.2rem' }} />
      </IconButton>
    </Box>
  );
};

export default ChatHeader;
