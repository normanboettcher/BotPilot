import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import type { ChatMessageType } from "../../domain/ChatMessage.ts";
import useBotResponsive from "../../hooks/useBotResponsive.ts";
import AlarmClock from "../icons/AlarmClock.tsx";

type Props = {
  msg: ChatMessageType;
};

const ChatMessage: React.FC<Props> = ({ msg }) => {
  const { sender, message: text, timestamp } = msg;
  const isUser = sender === "user";
  const { isMobile } = useBotResponsive();
  // Farben & Styles je nach Absender
  const backgroundColor = isUser ? "primary.main" : "grey.700";
  const textColor = "white";
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
        maxWidth: "100%",
        textShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography variant={isMobile ? "body1" : "body2"} pb={1} pt={0}>
        {text}
      </Typography>
      <Stack
        direction={"row"}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "start",
        }}
      >
        <AlarmClock />
        <Typography variant={"caption"} sx={{ paddingLeft: "5px" }}>
          {timestamp}
        </Typography>
      </Stack>
    </Box>
  );
};

export default ChatMessage;
