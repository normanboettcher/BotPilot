import { Box, Stack } from "@mui/material";
import React, { useState, type ChangeEventHandler } from "react";
import SendButton from "./SendButton";
import { useChatverlauf } from "../context/ChatContext";
import useMessageService from "../service/MessageService.ts";
import useMessageCreator from "../service/MessageCreator.ts";
import ChatTextField from "./ChatTextField.tsx";

const ChatInput: React.FC = () => {
  const { addMessage } = useChatverlauf();
  const [input, setInput] = useState<string>("");
  const { sendMessageAndGetResponse } = useMessageService();
  const { createChatMessage } = useMessageCreator();

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = createChatMessage(input, "user");
    addMessage(userMessage);
    setInput("");
    try {
      const response = await sendMessageAndGetResponse(input);
      response && addMessage(response);
    } catch (error) {
      console.error("Fehler beim Abrufen der Antwort:", error);
      const errorMessage = createChatMessage(
        "Fehler bei der Verbindung zum Server:",
        "bot",
      );
      addMessage(errorMessage);
    }
  };

  const onChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | undefined
  > = (e) => {
    setInput(e.target.value);
  };

  return (
    <Box maxHeight={280}>
      <Box
        id="chatbot-input"
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "0.5rem",
          flex: 1,
          "& .MuiInputBase-root": {
            padding: "0.5rem",
          },
        }}
      >
        <Stack direction={"column"} spacing={1}>
          <ChatTextField
            onChange={onChange}
            value={input}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                await handleSend();
                setInput("");
              }
            }}
          />
          <SendButton onClick={handleSend} />
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatInput;
