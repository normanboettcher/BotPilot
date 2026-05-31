import type { SVGProps } from 'react';
import React from 'react';
import { Avatar } from '@mui/material';
import { useTenantTheme } from '../../context/TenantThemeContext.tsx';

export function MessageChatbot(props?: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z" />
    </svg>
  );
}

const BotAvatar = () => {
  const { primaryColor } = useTenantTheme();
  return (
    <Avatar sx={{ bgcolor: primaryColor, width: 30, height: 30 }}>
      {MessageChatbot({ fill: 'white', width: '0.85em', height: '0.85em' })}
    </Avatar>
  );
};

export default BotAvatar;
