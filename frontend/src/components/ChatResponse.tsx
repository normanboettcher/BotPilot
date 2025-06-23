
import { Typography } from "@mui/material";
import React from "react";

type Props = {
    text?: string
}

const ChatResponse: React.FC<Props> = ({text}) => {
    return (
        <Typography
        id='chatbot-response'
        sx={{
            fontSize: '0.9rem',
            color: '#333'
        }}>
           {text} 
        </Typography>
    )
}

export default ChatResponse;