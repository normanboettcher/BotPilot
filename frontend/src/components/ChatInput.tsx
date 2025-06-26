import { Box, Stack, TextField } from "@mui/material";
import React, { useState, type ChangeEventHandler } from "react";
import SendButton from "./SendButton";
import { useChatverlauf } from "../context/ChatContext";
import type { BotResponse } from "../types";
import type {ChatMessageType} from "../domain/ChatMessage.types.ts";

const ChatInput: React.FC = () => {
  const { addMessage } = useChatverlauf();
  const [question, setQuestion] = useState<ChatMessageType | undefined>();
  const onClick = async () => {
    if (!question) return;
    addMessage(question);
    const res = await fetch(
      `http://localhost:8000/chat?q=${encodeURIComponent(question.message)}`
    );
    const data = (await res.json()) as BotResponse;
    const botMessage = createChatMessage(data.response, 'bot');
    addMessage(botMessage)
  };

  const createChatMessage = (text: string, sender: "user" | "bot") => {
    const date: Date = new Date();
    const chatMessage: ChatMessageType = {
      sender: sender,
      message: text,
      timestamp: `${date.getDay()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
    };
    return chatMessage;
  };

  const onChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | undefined
  > = (e) => {
    const chatMessage = createChatMessage(e.target.value, 'user');
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
