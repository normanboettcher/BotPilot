import React from "react";
import { Box, Typography } from "@mui/material";
import type { ChatMessageType } from "../../domain/ChatMessage.ts";

type Props = {
  msg: ChatMessageType;
};

const ChatMessage: React.FC<Props> = ({ msg }) => {
  const { sender, message: text, timestamp } = msg;
  const isUser = sender === "user";
  // Farben & Styles je nach Absender
  const backgroundColor = isUser ? "primary.main" : "grey.200";
  const textColor = isUser ? "white" : "black";
  const align = isUser ? "flex-end" : "flex-start";
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignText: align,
        backgroundColor,
        color: textColor,
        borderRadius: "16px",
        borderTopLeftRadius: sender === "bot" ? "0px" : "16px",
        borderTopRightRadius: sender === "user" ? "0px" : "16px",
        p: 1.5,
        m: 0.5,
        minWidth: "80%",
        maxWidth: "80%",
      }}
    >
      <Typography
        variant={"body2"}
        pb={1}
        pt={0}
        sx={{
          width: {
            xs: "100%",
            sm: "100%",
            md: "100%",
            lg: "100%",
          },
        }}
      >
        {" "}
        {text}
      </Typography>
      <Typography
        sx={{ display: "flex", alignSelf: "flex-end" }}
        variant={"caption"}
      >
        {timestamp}
      </Typography>
    </Box>
  );
};

export default ChatMessage;
