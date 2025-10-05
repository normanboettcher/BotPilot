import { Typography, type TypographyProps } from '@mui/material';
import React from 'react';

const ChatMessageTextComponent: React.FC<TypographyProps> = ({ ...props }) => {
  return (
    <Typography
      variant={'body2'}
      justifyContent={'flex-start'}
      pb={1}
      pt={0}
      sx={{
        wordBreak: 'word-break',
        whiteSpace: 'pre-wrap',
      }}
      {...props}
    >
      {props.children}
    </Typography>
  );
};
export default ChatMessageTextComponent;
