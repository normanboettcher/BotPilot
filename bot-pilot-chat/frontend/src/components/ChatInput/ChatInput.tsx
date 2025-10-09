import { Box } from '@mui/material';
import React, { useState, type ChangeEventHandler } from 'react';
import ChatTextField from './ChatTextField.tsx';
import SendIconButton from '../Buttons/SendIconButton.tsx';
import useBotResponsive from '../../hooks/useBotResponsive.ts';
import useMessageService from '../../service/MessageService.ts';

const ChatInput: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const { sendMessageAndGetResponse } = useMessageService();

  const onChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | undefined
  > = (e) => {
    setInput(e.target.value);
  };
  const { isDarkTheme } = useBotResponsive();
  return (
    <Box
      id="chatbot-input"
      maxHeight={280}
      p={1}
      sx={{
        backgroundColor: isDarkTheme ? 'grey.500' : 'inherit',
        borderRadius: '8px',

        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      }}
    >
      <ChatTextField
        onChange={onChange}
        sendButton={
          <SendIconButton
            onClick={async () => {
              await sendMessageAndGetResponse(input);
              setInput('');
            }}
          />
        }
        value={input}
        onKeyDown={async (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await sendMessageAndGetResponse(input);
            setInput('');
          }
        }}
      />
    </Box>
  );
};

export default ChatInput;
