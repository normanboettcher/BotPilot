import { Box } from "@mui/material";
import React, { useState } from "react";
import ChatBotButton from "./ChatBotButton";
import Chatbox from "./Chatbox";

const BotContainer = (): React.ReactNode => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <Box
      id="chatbot-container"
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        fontFamily: "sans-serif",
        zIndex: 9999,
      }}
    >
      <ChatBotButton onClick={() => setVisible(!visible)} />
      <Chatbox visible={true} />
    </Box>
  );
};

export default BotContainer;
