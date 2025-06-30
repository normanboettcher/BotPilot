import { Box, Button } from "@mui/material";
import React from "react";

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const SendButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Box>
      <Button
        id="chatbot-send"
        fullWidth
        onClick={onClick}
        sx={{
          display: "flex",
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
          padding: "0.5rem",
          cursor: "pointer",
          borderRadius: "8px",
          marginBottom: "0.5rem",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#059669",
          },
        }}
      >
        Senden
      </Button>
    </Box>
  );
};

export default SendButton;
