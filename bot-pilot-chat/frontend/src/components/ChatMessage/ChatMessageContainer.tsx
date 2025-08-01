import React from "react";
import SenderAvatar from "../Avatar/SenderAvatar.tsx";
import type { ChatMessageType } from "../../domain/ChatMessage.ts";
import { Box, Stack } from "@mui/material";
import ChatMessage from "./ChatMessage.tsx";

type Props = {
  chatMessage: ChatMessageType;
};

const ChatMessageContainer: React.FC<Props> = ({ chatMessage }) => {
  const { sender } = chatMessage;
  return (
    <Box
      width={"100%"}
      display={"flex"}
      justifyContent={sender === "user" ? "flex-end" : "flex-start"}
    >
      <Stack
        alignItems={"flex-start"}
        direction={sender === "user" ? "row-reverse" : "row"}
        spacing={1}
      >
        <Box sx={{ position: "relative", top: "-15px" }}>
          <SenderAvatar sender={sender} />
        </Box>
        <Box width={"80%"}>
          <ChatMessage msg={chatMessage} />
        </Box>
      </Stack>
    </Box>
  );
};

export default ChatMessageContainer;
