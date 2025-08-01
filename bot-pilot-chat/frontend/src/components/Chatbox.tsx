import { Paper } from "@mui/material";
import React from "react";
import ChatInput from "./ChatInput/ChatInput.tsx";
import Chatverlauf from "./Chatverlauf";
import useBotResponsive from "../hooks/useBotResponsive.ts";

type Props = {
  visible: boolean;
};

const Chatbox: React.FC<Props> = ({ visible }) => {
  const { isMobile } = useBotResponsive();
  return (
    <Paper
      id="chatbox"
      elevation={4}
      sx={{
        width: isMobile ? "90wv" : 400,
        maxWidth: isMobile ? 360 : 400,
        height: isMobile ? "90%" : "auto",
        display: visible ? "flex" : "none",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "grey.200",
        border: "1px solid #ccc",
        padding: "1rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <Chatverlauf />
      <ChatInput />
    </Paper>
  );
};

export default Chatbox;
