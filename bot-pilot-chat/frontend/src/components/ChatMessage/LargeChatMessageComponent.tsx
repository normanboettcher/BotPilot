import { Box, Typography } from "@mui/material";
import React from "react";
import type { ChatMessageComponentProps } from "./ChatMessageComponent.types.ts";

const LargeChatMessageComponent: React.FC<ChatMessageComponentProps> = ({
  backgroundColor,
  textColor,
  align,
  text,
}) => {
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

export default LargeChatMessageComponent;
