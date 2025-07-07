import type { ChatMessageComponentProps } from "./ChatMessageComponent.types.ts";
import React from "react";
import { Chip } from "@mui/material";

const SmallChatMessageComponent: React.FC<ChatMessageComponentProps> = ({
  backgroundColor,
  textColor,
  align,
  text,
}) => {
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
};

export default SmallChatMessageComponent;
