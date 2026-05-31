import React from 'react';
import type { GeneralButtonProps } from '../../domain/GeneralButtonProps.ts';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTenantTheme } from '../../context/TenantThemeContext.tsx';

const SendIconButton: React.FC<GeneralButtonProps> = ({ onClick }) => {
  const { primaryColor } = useTenantTheme();
  return (
    <IconButton
      onClick={onClick}
      sx={{
        backgroundColor: primaryColor,
        color: '#ffffff',
        width: 36,
        height: 36,
        '&:hover': {
          backgroundColor: primaryColor,
          filter: 'brightness(1.12)',
        },
      }}
    >
      <SendIcon sx={{ fontSize: '1rem' }} />
    </IconButton>
  );
};

export default SendIconButton;
