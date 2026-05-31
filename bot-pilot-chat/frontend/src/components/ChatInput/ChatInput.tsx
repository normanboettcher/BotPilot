import { Box } from '@mui/material';
import React, { useState, type ChangeEventHandler } from 'react';
import ChatTextField from './ChatTextField.tsx';
import SendIconButton from '../Buttons/SendIconButton.tsx';
import useMessageService from '../../service/MessageService.ts';

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessageAndGetResponse } = useMessageService();

  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setInput(e.target.value);
  };

  const sendIfNotEmpty = async () => {
    if (input.trim() !== '') {
      await sendMessageAndGetResponse(input);
    }
  };

  return (
    <Box
      id="chatbot-input"
      sx={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        px: 1.5,
        py: 1,
        flexShrink: 0,
      }}
    >
      <ChatTextField
        onChange={onChange}
        value={input}
        onKeyDown={async (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await sendIfNotEmpty();
            setInput('');
          }
        }}
        sendButton={
          <SendIconButton
            onClick={async () => {
              await sendIfNotEmpty();
              setInput('');
            }}
          />
        }
      />
    </Box>
  );
};

export default ChatInput;
