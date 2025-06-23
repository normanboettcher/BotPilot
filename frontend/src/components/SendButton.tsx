
import { Button } from "@mui/material";
import React from "react";

const SendButton = () => {
    return (
        <Button
        id ='chatbot-send'
        fullWidth
        sx={{
            display: 'flex',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            padding: '0.5rem',
            cursor: 'pointer',
            borderRadius: '8px',
            marginBottom: '0.5rem',
            textTransform: 'none',
            flex: 1,
             "&:hover": {
              backgroundColor: "#059669",
            },
        }}>
            Senden
        </Button>
    )
}

export default SendButton;