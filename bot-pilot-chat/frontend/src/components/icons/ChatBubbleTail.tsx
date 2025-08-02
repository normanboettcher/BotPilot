import React from 'react';

const ChatBubbleTail = ({ isUser, color }: { isUser: boolean; color: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    style={{
      position: 'absolute',
      top: 0,
      left: isUser ? 'auto' : -10,
      right: isUser ? -10 : 'auto',
      transform: isUser ? 'translateY(5%) rotate(135deg)' : 'rotate(-135deg)',
    }}
  >
    <polygon points="0,0 20,0 10,10" fill={color} />
  </svg>
);
export default ChatBubbleTail;
