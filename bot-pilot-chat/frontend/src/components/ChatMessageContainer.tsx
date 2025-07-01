import React from "react";
import SenderAvatar from "./SenderAvatar.tsx";
import type { ChatMessageType } from "../domain/ChatMessage.ts";
import { Stack } from "@mui/material";
import ChatMessage from "./ChatMessage.tsx";

type Props = {
  chatMessage: ChatMessageType;
};

const ChatMessageContainer: React.FC<Props> = ({ chatMessage }) => {
  const { sender, message } = chatMessage;
  return (
    <Stack direction={sender === "bot" ? "row-reverse" : "row"} spacing={1}>
      <SenderAvatar sender={sender} />
      <ChatMessage sender={sender} text={message} />
    </Stack>
  );
};

export default ChatMessageContainer;
