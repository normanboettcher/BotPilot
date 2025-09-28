import { Box } from '@mui/material';
import React, { useState, type ChangeEventHandler } from 'react';
import { useChatverlauf } from '../../context/ChatContext.tsx';
import useMessageService from '../../service/MessageService.ts';
import useMessageCreator from '../../service/MessageCreator.ts';
import ChatTextField from './ChatTextField.tsx';
import SendIconButton from '../Buttons/SendIconButton.tsx';
import useBotResponsive from '../../hooks/useBotResponsive.ts';

const ChatInput: React.FC = () => {
  const { addMessage } = useChatverlauf();
  const [input, setInput] = useState<string>('');
  const { sendMessageAndGetResponse } = useMessageService();
  const { createChatMessage } = useMessageCreator();

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = createChatMessage(input, 'user');
    addMessage(userMessage);
    setInput('');
    try {
      await sendMessageAndGetResponse(input);
      //response && addMessage(response);
    } catch (error) {
      console.error('Fehler beim Abrufen der Antwort:', error);
      const errorMessage = createChatMessage(
        'Fehler bei der Verbindung zum Server:',
        'bot'
      );
      addMessage(errorMessage);
    }
  };

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
        sendButton={<SendIconButton onClick={handleSend} />}
        value={input}
        onKeyDown={async (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await handleSend();
            setInput('');
          }
        }}
      />
    </Box>
  );
};

export default ChatInput;
