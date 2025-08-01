import React from 'react';
import { InputAdornment, TextField, type TextFieldProps } from '@mui/material';
import type { BotTextFieldProps } from '../../domain/BotTextFieldProps.ts';

const ChatTextField: React.FC<TextFieldProps & BotTextFieldProps> = ({ ...props }) => {
  return (
    <TextField
      InputProps={{
        endAdornment: props.sendButton && (
          <InputAdornment position={'end'}>{props.sendButton}</InputAdornment>
        ),
        disableUnderline: true,
      }}
      sx={{
        fontSize: {
          xs: '1rem',
          sm: '1rem',
        },
        '& .MuiInputBase-root': {
          padding: '0.5rem',
          borderRadius: '8px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
      }}
      variant="standard"
      multiline
      maxRows={4}
      minRows={3}
      onChange={props.onChange}
      value={props.value}
      onKeyDown={props.onKeyDown}
      placeholder="Nachricht eingeben..."
      size="medium"
      fullWidth
    />
  );
};

export default ChatTextField;
