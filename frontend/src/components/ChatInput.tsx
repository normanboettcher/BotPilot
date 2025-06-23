import { Box, TextField } from "@mui/material";
import React from "react";

const ChatInput: React.FC = () => {
  return (
    <Box
      id="chatbot-input"
      sx={{
        padding: "0.5rem",
        marginBottom: "0.5rem",
        flex: 1,
        "& .MuiInputBase-root": {
          padding: "0.5rem",
        },
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Frage eingeben..."
        size="small"
        fullWidth
      />
    </Box>
  );
};

export default ChatInput;
