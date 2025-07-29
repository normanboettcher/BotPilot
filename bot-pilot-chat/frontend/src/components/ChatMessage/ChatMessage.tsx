import React from "react";
import type {Sender} from "../../domain/Sender.ts";
import {Box, Typography} from "@mui/material";

type Props = {
    text: string;
    sender: Sender;
};

const ChatMessage: React.FC<Props> = ({text, sender}) => {
    const isUser = sender === "user";
    // Farben & Styles je nach Absender
    const backgroundColor = isUser ? "primary.main" : "grey.200";
    const textColor = isUser ? "white" : "black";
    const align = isUser ? "flex-end" : "flex-start";
    return (
        <Box
            sx={{
                display: 'flex',
                alignText: align,
                backgroundColor,
                color: textColor,
                borderRadius: '16px',
                borderTopLeftRadius: sender === "bot" ? "0px" : "16px",
                borderRadiusTopRight: sender === "user" ? "0px" : "16px",
                p: 1.5,
                m: 0.5,
                minWidth: "70%",
                maxWidth: "70%",
            }}
        >
            <Typography variant={'body2'} pb={1} pt={0}>{text}</Typography>
        </Box>
    )
};

export default ChatMessage;
