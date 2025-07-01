import React from "react";
import type { GeneralButtonProps } from "../domain/GeneralButtonProps.ts";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const SendIconButton: React.FC<GeneralButtonProps> = ({ onClick }) => {
  return (
    <IconButton onClick={onClick}>
      <SendIcon />
    </IconButton>
  );
};
export default SendIconButton;
