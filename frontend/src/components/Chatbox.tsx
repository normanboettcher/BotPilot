import { Box } from "@mui/material";
import React from "react";
import ChatInput from "./ChatInput";
import SendButton from "./SendButton";
import ChatResponse from "./ChatResponse";

type Props = {
  visible: boolean;
};

const Chatbox: React.FC<Props> = ({ visible }) => {
  console.log("vsible", visible);
  return (
    <Box
      id="chatbox"
      sx={{
        display: visible ? "flex" : "none",
        flexDirection: 'column',
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "12px",
        padding: "1rem",
        width: "280px",
        marginBottom: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        mt: 2
      }}
    >
      <Box>
      <ChatInput />
      <SendButton />
      </Box>
      <ChatResponse />
    </Box>
  );
};

export default Chatbox;
