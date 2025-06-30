import React from "react";
import type { Sender } from "../domain/Sender.ts";
import { Box, Chip, Typography } from "@mui/material";

type Props = {
  text: string;
  sender: Sender;
};

const ChatMessage: React.FC<Props> = ({ text, sender }) => {
  const isUser = sender === "user";
  // Farben & Styles je nach Absender
  const backgroundColor = isUser ? "primary.main" : "grey.200";
  const textColor = isUser ? "white" : "black";
  const align = isUser ? "flex-end" : "flex-start";
  const useChip = text.length > 50;
  if (useChip) {
    return (
      <Chip
        sx={{
          alignSelf: align,
          color: textColor,
          height: "auto",
          "& .MuiChip-label": {
            display: "block",
            whiteSpace: "normal",
          },
          borderRadius: "16px",
          p: 1.5,
          maxWidth: "80%",
          whiteSpace: "normal",
          wordBreak: "break-word",
          fontSize: "0.875rem",
          backgroundColor,
        }}
        size="medium"
        variant="filled"
        label={text}
      />
    );
  }
  return (
    <Box
      sx={{
        alignSelf: align,
        backgroundColor,
        color: textColor,
        borderRadius: 2,
        p: 1.5,
        m: 0.5,
        maxWidth: "70%",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
};

export default ChatMessage;
