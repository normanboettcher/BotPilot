import type { SVGProps } from 'react';
import React from 'react';
import { Avatar } from '@mui/material';
import { useTenantTheme } from '../../context/TenantThemeContext.tsx';

function User3Fill(props?: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M20 22H4v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5zm-8-9a6 6 0 1 1 0-12a6 6 0 0 1 0 12"
      />
    </svg>
  );
}

const UserAvatar = () => {
  const { userBubbleColor } = useTenantTheme();
  return (
    <Avatar sx={{ bgcolor: userBubbleColor, width: 30, height: 30 }}>
      {User3Fill({ width: '0.85em', height: '0.85em' })}
    </Avatar>
  );
};

export default UserAvatar;
