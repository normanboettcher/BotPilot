import React from 'react';
import { InputAdornment, TextField, type TextFieldProps } from '@mui/material';
import type { BotTextFieldProps } from '../../domain/BotTextFieldProps.ts';

const ChatTextField: React.FC<TextFieldProps & BotTextFieldProps> = ({ ...props }) => {
  return (
    <TextField
      InputProps={{
        endAdornment: props.sendButton && (
          <InputAdornment position="end" sx={{ alignSelf: 'flex-end', mb: 0.5 }}>
            {props.sendButton}
          </InputAdornment>
        ),
        disableUnderline: true,
        sx: {
          bgcolor: '#f8fafc',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          px: 1.5,
          py: 0.5,
          alignItems: 'flex-end',
          '&:hover': { borderColor: '#cbd5e1' },
          '&.Mui-focused': {
            borderColor: '#1e40af',
            boxShadow: '0 0 0 3px rgba(30,64,175,0.08)',
          },
          transition: 'border-color 0.15s, box-shadow 0.15s',
        },
      }}
      sx={{ '& .MuiInputBase-root': { padding: 0 } }}
      variant="standard"
      multiline
      maxRows={4}
      minRows={2}
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
