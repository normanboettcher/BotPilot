import { Box, Stack, TextField } from "@mui/material";
import React, { useState, type ChangeEventHandler } from "react";
import SendButton from "./SendButton";
import { useChatverlauf } from "../context/ChatContext";
import type { ChatMessage } from "../domain/ChatMessage";

const ChatInput: React.FC = () => {
  const { addMessage } = useChatverlauf();
  const [question, setQuestion] = useState<ChatMessage | undefined>();
  const onClick = () => {
    question && addMessage(question);
  };

  const onChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | undefined
  > = (e) => {
    const date: Date = new Date();
    const chatMessage: ChatMessage = {
      sender: "user",
      message: e.target.value,
      timestamp: `${date.getDay()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
    };
    setQuestion(chatMessage);
  };

  return (
    <Box
      id="chatbot-input"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        marginBottom: "0.5rem",
        flex: 1,
        "& .MuiInputBase-root": {
          padding: "0.5rem",
        },
      }}
    >
      <Stack direction={"column"} spacing={1}>
        <TextField
          variant="outlined"
          onChange={onChange}
          placeholder="Frage eingeben..."
          size="small"
          fullWidth
        />
        <SendButton onClick={onClick} />
      </Stack>
    </Box>
  );
};

export default ChatInput;
