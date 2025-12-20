import type { SVGProps } from 'react';
import React from 'react';
import { Avatar } from '@mui/material';
import { useChatMessageGraphicsService } from '../../service/graphics/ChatMessageGraphicsService.ts';

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
  const { chatBubbleColorBot } = useChatMessageGraphicsService();
  return (
    <Avatar
      sx={{
        bgcolor: chatBubbleColorBot,
      }}
    >
      {MessageChatbot({ fill: 'white' })}
    </Avatar>
  );
};
export default BotAvatar;
